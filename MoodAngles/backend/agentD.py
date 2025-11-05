#!/usr/bin/env python3
# agentD.py  — diagnostic explanation generator (with fallback)

import sys
import json
import os
import traceback

# attempt to import OpenAI; if unavailable we fallback
try:
    from dotenv import load_dotenv
    from openai import OpenAI, APIError
    load_dotenv()
    OPENAI_AVAILABLE = True
except Exception:
    OPENAI_AVAILABLE = False

def deterministic_summary(score, level, agentR_result):
    # Simple deterministic text for fallback — short, neutral, actionable
    if score is None:
        return "We do not have enough information to provide a summary."
    try:
        s = float(score)
    except Exception:
        s = None

    if s is None:
        return f"Agent R indicated: {agentR_result}. Consider discussing these findings with a professional."

    if s <= 19:
        return "This score suggests a low chance of bipolar disorder. Continue routine self-monitoring and seek help if symptoms change."
    if s <= 50:
        return "This score suggests a moderate chance of mood instability. Tracking symptoms and consulting a mental health professional could help clarify the situation."
    if s <= 74:
        return "This score indicates some concerning symptoms. Please consider scheduling a consultation with a mental health provider to review these patterns."
    if s <= 86:
        return "This score suggests significant behavioral dysregulation. Seeking a professional evaluation is recommended to determine next steps."
    return "This score indicates a high likelihood of bipolar-spectrum difficulties. Please contact a qualified mental health professional as soon as possible."

def main():
    raw = sys.stdin.read()
    try:
        data = json.loads(raw)
    except Exception as e:
        print(json.dumps({"error": "invalid_json", "details": str(e)}))
        sys.exit(1)

    agentR_result = data.get("agentR_result") or data.get("agentR") or ""
    score = data.get("score")
    level = data.get("level", "")

    # If OpenAI not available or API key missing, return deterministic fallback
    if not OPENAI_AVAILABLE or not os.getenv("OPENAI_API_KEY"):
        out = deterministic_summary(score, level, agentR_result)
        print(json.dumps({"result": out}))
        return

    # Try OpenAI but handle exceptions and fallback
    try:
        client = OpenAI(api_Key=os.getenv("OPENAI_API_KEY"))
        prompt = f"""
You are Agent D, a follow-up diagnostic summarizer for a mental-health screener.
Given:
- Agent R’s determination: "{agentR_result}"
- Numeric score: {score}
- Level interpretation: "{level}"

Write 2–4 concise sentences that:
1. Explain what this level means in simple terms.
2. Suggest next steps (professional evaluation, monitoring, self-care).
Keep it friendly and factual. Output ONLY plain text (no lists, no JSON).
"""
        resp = client.responses.create(
            model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
            input=[{"role": "system", "content": "You are Agent D, a concise, empathetic summarizer."},
                   {"role": "user", "content": prompt}],
            max_output_tokens=200
        )

        # best-effort extract text
        out_text = None
        try:
            out_text = getattr(resp, "output_text", None)
            if not out_text:
                # try to parse dict-like
                d = resp.to_dict() if hasattr(resp, "to_dict") else (resp if isinstance(resp, dict) else None)
                if isinstance(d, dict):
                    # walk common shapes
                    out_text = d.get("output_text") or d.get("result") or None
                if not out_text:
                    out_text = str(resp)
        except Exception:
            out_text = str(resp)

        if out_text is None:
            raise Exception("No output text from OpenAI response")

        # Clean and return
        print(json.dumps({"result": str(out_text).strip()}))
        return

    except Exception as e:
        # print stack to stderr (so server can capture it) and fallback
        traceback.print_exc(file=sys.stderr)
        fallback = deterministic_summary(score, level, agentR_result)
        print(json.dumps({"result": fallback, "warning": "OpenAI_failed", "details": str(e)}))
        return

if __name__ == "__main__":
    main()
