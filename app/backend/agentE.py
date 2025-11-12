#!/usr/bin/env python3
# agentE.py — Agent E: Debate and Consensus Generator

import sys
import json
import os
import re
import traceback
from dotenv import load_dotenv
from openai import OpenAI, APIError

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def safe_json_output(obj):
    try:
        sys.stdout.buffer.write(json.dumps(obj, ensure_ascii=False).encode("utf-8", "replace"))
    except Exception:
        sys.stdout.write(json.dumps({"error": "json_dump_failed"}))

def extract_text(resp):
    try:
        t = getattr(resp, "output_text", None)
        if isinstance(t, str): return t.strip()
    except Exception:
        pass
    return str(resp)

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
        resp = client.responses.create(
            model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
            input=[
                {"role": "system", "content": "You are Agent E, an impartial debate moderator."},
                {"role": "user", "content": prompt}
            ],
            max_output_tokens=600
        )

        text = extract_text(resp)

        # Remove ```json fences if present
        text = re.sub(r"^```(?:json)?", "", text, flags=re.IGNORECASE).strip("` \n")
        text = re.sub(r"```$", "", text).strip()

        try:
            parsed = json.loads(text)
        except Exception:
            # fallback: wrap as one field
            parsed = {"final_consensus": text}

        safe_json_output(parsed)

    except APIError as e:
        tb = traceback.format_exc()
        safe_json_output({"error": "openai_api_error", "details": str(e), "traceback": tb})
    except Exception as e:
        tb = traceback.format_exc()
        safe_json_output({"error": "unexpected_error", "details": str(e), "traceback": tb})

if __name__ == "__main__":
    main()
