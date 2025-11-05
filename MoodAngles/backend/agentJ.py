#!/usr/bin/env python3
# agentJ.py — Judge agent: produce a compact, structured decision after debate

import sys
import json
import os
import traceback
from dotenv import load_dotenv
from openai import OpenAI, APIError

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def sanitize_string(s: str) -> str:
    if not isinstance(s, str):
        return s
    out_chars = []
    for ch in s:
        cp = ord(ch)
        if 0xD800 <= cp <= 0xDFFF:
            out_chars.append("\uFFFD")
        else:
            out_chars.append(ch)
    return "".join(out_chars)

def sanitize_obj(obj):
    if isinstance(obj, str):
        return sanitize_string(obj)
    if isinstance(obj, dict):
        return {sanitize_string(k): sanitize_obj(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [sanitize_obj(v) for v in obj]
    if isinstance(obj, tuple):
        return tuple(sanitize_obj(v) for v in obj)
    return obj

def safe_print_json(obj):
    try:
        sys.stdout.buffer.write(json.dumps(obj, ensure_ascii=False).encode("utf-8", "replace"))
    except Exception:
        sys.stdout.write(json.dumps({"error": "print_failed", "preview": str(obj)}))

def main():
    try:
        raw = sys.stdin.read()
        data = json.loads(raw or "{}")
    except Exception as e:
        safe_print_json({"error": "invalid_json", "details": str(e)})
        return

    # input fields we expect (all optional but helpful)
    agentR = data.get("agentR_result", "")
    agentD = data.get("agentD_result", "")
    agentC = data.get("agentC_result", "")
    agentE = data.get("agentE_result", "")
    score = data.get("score")
    level = data.get("level", "")

    # Compose judge prompt
    prompt = f"""
You are Agent J (Judge). You receive short outputs from prior agents about a screening.
Inputs:
- Agent R: "{agentR}"
- Agent D: "{agentD}"
- Agent C: "{agentC}"
- Agent E (debate/consensus): "{agentE}"
- Numeric score: {score}
- Level classification: "{level}"

Task:
Produce a concise, evidence-based judgment. Output ONLY valid JSON (no extra text) with the following keys:
- "decision": short label (e.g., "Likely", "Possible", "Unlikely", "Insufficient evidence").
- "confidence": a number between 0.0 and 1.0 representing confidence.
- "reasoning": 1-3 brief sentences explaining why (cite which agent outputs or score inform the decision).
- "actions": an array of 0..3 short recommended next actions (e.g., "Schedule professional evaluation", "Monitor mood for 2 weeks", "Immediate emergency care if suicidal ideation").

Keep language neutral, avoid alarmist phrasing. Keep fields short and machine-friendly.
"""

    messages = [
        {"role": "system", "content": "You are Agent J, an impartial clinical judge who turns combined agent outputs into a single structured decision."},
        {"role": "user", "content": prompt}
    ]

    try:
        resp = client.responses.create(
            model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
            input=messages,
            max_output_tokens=250
        )
        # Best-effort extract text
        out_text = getattr(resp, "output_text", None) or str(resp)

        # sometimes the model returns fenced JSON; try extracting
        text = str(out_text).strip()
        # remove markdown fences if present
        if text.startswith("```"):
            # find first newline after opening fence
            parts = text.split("\n")
            # remove fence lines
            if parts[0].startswith("```"):
                parts = parts[1:]
            # drop final fence if present
            if parts and parts[-1].strip().startswith("```"):
                parts = parts[:-1]
            text = "\n".join(parts).strip()

        # try to parse JSON
        try:
            parsed = json.loads(text)
        except Exception:
            # If the model returned non-json, wrap into fallback JSON
            parsed = {"decision": "", "confidence": 0.0, "reasoning": text, "actions": []}

        parsed = sanitize_obj(parsed)
        safe_print_json(parsed)

    except APIError as e:
        tb = traceback.format_exc()
        safe_print_json({"error": "openai_api_error", "details": str(e), "traceback": tb})
    except Exception as e:
        tb = traceback.format_exc()
        safe_print_json({"error": "unexpected_error", "details": str(e), "traceback": tb})

if __name__ == "__main__":
    main()
