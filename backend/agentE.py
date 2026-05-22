#!/usr/bin/env python3
# agentE.py — Agent E: Debate and Consensus Generator

import sys
import json
import os
import re
import traceback

try:
    from dotenv import load_dotenv
    from openai import OpenAI, APIError
    load_dotenv()
    OPENAI_AVAILABLE = True
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY", os.getenv("OPENAI_API_KEY"))
    )
except Exception:
    OPENAI_AVAILABLE = False
    client = None

def deterministic_debate(agentR_result, agentD_result, agentC_result, condition):
    summary = agentR_result or agentD_result or agentC_result or "insufficient data"
    return {
        "supportive_argument": f"The evidence suggests {condition} may be present based on reported patterns.",
        "counter_argument": f"However, {summary} — more information would help clarify.",
        "final_consensus": f"Further professional evaluation is recommended to confirm or rule out {condition}."
    }

def safe_json_output(obj):
    try:
        sys.stdout.buffer.write(json.dumps(obj, ensure_ascii=False).encode("utf-8", "replace"))
    except Exception:
        sys.stdout.write(json.dumps({"error": "json_dump_failed"}))

def main():
    try:
        raw = sys.stdin.read()
        data = json.loads(raw or "{}")
    except Exception as e:
        safe_json_output({"error": "invalid_json", "details": str(e)})
        return

    agentR_result = data.get("agentR_result", "")
    agentD_result = data.get("agentD_result", "")
    agentC_result = data.get("agentC_result", "")
    condition = data.get("condition", "the condition")

    # Use deterministic fallback if OpenAI unavailable or no API key
    if not OPENAI_AVAILABLE or not os.getenv("OPENROUTER_API_KEY"):
        fallback = deterministic_debate(agentR_result, agentD_result, agentC_result, condition)
        safe_json_output(fallback)
        return

    prompt = f"""
You are Agent E — a diagnostic debate coordinator.

Context:
- Agent R (Reasoning): {agentR_result}
- Agent D (Description): {agentD_result}
- Agent C (Comparison): {agentC_result}
- Target condition: {condition}

Task:
1. Create a short debate between two experts:
    • **Supportive AI:** argues why the diagnosis is likely.
    • **Skeptical AI:** argues why it may not be certain or could be explained otherwise.
2. Then, as a **Moderator**, summarize the balanced consensus in 1–2 sentences.
3. Respond only as a JSON object:

{{
  "supportive_argument": "text",
  "counter_argument": "text",
  "final_consensus": "text"
}}
"""

    try:
        resp = client.chat.completions.create(
            model=os.getenv("LLM_MODEL", "openrouter/free"),
            messages=[
                {"role": "system", "content": "You are Agent E, an impartial debate moderator."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
            timeout=30
        )

        text = resp.choices[0].message.content or ""

        # Remove ```json fences if present
        text = re.sub(r"^```(?:json)?", "", text, flags=re.IGNORECASE).strip("` \n")
        text = re.sub(r"```$", "", text).strip()

        try:
            parsed = json.loads(text) if text else None
        except Exception:
            parsed = None

        if not parsed or not isinstance(parsed, dict):
            # Use fallback if no valid JSON or empty response
            fallback = deterministic_debate(agentR_result, agentD_result, agentC_result, condition)
            parsed = fallback

        safe_json_output(parsed)

    except APIError as e:
        tb = traceback.format_exc()
        fallback = deterministic_debate(agentR_result, agentD_result, agentC_result, condition)
        safe_json_output({"error": "openai_api_error", "details": str(e), "traceback": tb, "fallback_used": True, "fallback_result": fallback})
    except Exception as e:
        tb = traceback.format_exc()
        fallback = deterministic_debate(agentR_result, agentD_result, agentC_result, condition)
        safe_json_output({"error": "unexpected_error", "details": str(e), "traceback": tb, "fallback_used": True, "fallback_result": fallback})

if __name__ == "__main__":
    main()