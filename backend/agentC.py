#!/usr/bin/env python3
# agentC.py — Agent C: comparative summarizer with sanitization, markdown cleanup, and robust output.

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


# =================== UTF-8 & STRUCTURE SANITIZERS ===================

def sanitize_string(s: str) -> str:
    """Replace lone UTF-16 surrogate code units with safe Unicode."""
    if not isinstance(s, str):
        return s
    return "".join(ch if not 0xD800 <= ord(ch) <= 0xDFFF else "\uFFFD" for ch in s)

def sanitize_obj(obj):
    """Recursively sanitize strings inside dicts/lists."""
    if isinstance(obj, str):
        return sanitize_string(obj)
    if isinstance(obj, dict):
        return {sanitize_string(k): sanitize_obj(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [sanitize_obj(v) for v in obj]
    if isinstance(obj, tuple):
        return tuple(sanitize_obj(v) for v in obj)
    return obj

def safe_json_output(obj):
    """Safely write JSON as UTF-8 bytes (no surrogate errors)."""
    try:
        sys.stdout.buffer.write(json.dumps(obj, ensure_ascii=False).encode("utf-8", "replace"))
    except Exception:
        sys.stdout.write(json.dumps({"error": "json_dump_failed"}))

def deterministic_summary(agentR_result, agentD_result, score, level):
    if score is not None:
        try:
            s = float(score)
            if s <= 19:
                verdict = "low likelihood"
            elif s <= 50:
                verdict = "moderate likelihood"
            elif s <= 74:
                verdict = "some concern"
            elif s <= 86:
                verdict = "significant concern"
            else:
                verdict = "high likelihood"
        except Exception:
            verdict = "unclear"
    else:
        verdict = "unclear"
    return f"{agentR_result or 'Findings'} suggest {verdict}. {agentD_result or 'Further evaluation recommended'}."

# =================== OPENAI RESPONSE PARSING ===================

def extract_text_from_resp(resp):
    """Robustly extract text from OpenAI Responses API result."""
    try:
        out = getattr(resp, "output_text", None)
        if isinstance(out, str) and out.strip():
            return out.strip()
    except Exception:
        pass

    try:
        if isinstance(resp, dict) and resp.get("output_text"):
            return str(resp.get("output_text")).strip()
    except Exception:
        pass

    try:
        if hasattr(resp, "to_dict"):
            d = resp.to_dict()
            if "output_text" in d:
                return d["output_text"]
    except Exception:
        pass

    return str(resp)


# =================== MAIN EXECUTION ===================

def main():
    try:
        raw = sys.stdin.read()
        data = json.loads(raw or "{}")
    except Exception as e:
        safe_json_output({"error": "invalid_json", "details": str(e)})
        return

    agentR_result = data.get("agentR_result", "")
    agentD_result = data.get("agentD_result", "")
    score = data.get("score")
    level = data.get("level", "")
    answers = data.get("answers", {})

    if not any([agentR_result, agentD_result, answers]):
        safe_json_output({
            "error": "no_context_provided",
            "details": "Need at least one of agentR_result, agentD_result, or answers."
        })
        return

    # Use deterministic fallback if OpenAI unavailable or no API key
    if not OPENAI_AVAILABLE or not os.getenv("OPENAI_API_KEY"):
        fallback = deterministic_summary(agentR_result, agentD_result, score, level)
        safe_json_output({"result": fallback})
        return

    # Format answers
    if isinstance(answers, dict) and answers:
        formatted_answers = "\n".join([f"{k}: {v}" for k, v in answers.items()])
    else:
        formatted_answers = "No detailed responses provided."

    prompt = f"""
You are Agent C, an AI comparative reasoning assistant.
Integrate and summarize the diagnostic findings concisely.

Context:
- Agent R finding: "{agentR_result}"
- Agent D summary: "{agentD_result}"
- Numeric score: {score}
- Level: "{level}"
- Responses: {formatted_answers}

Task:
Summarize the combined insights from Agents R and D in 3–4 short sentences.
Include what the findings imply and the recommended next step (e.g., monitoring, self-care, or professional evaluation).
Output only the final summary — no JSON, no code block, no markdown formatting.
"""

    messages = [
        {"role": "system", "content": "You are Agent C, a balanced, evidence-based clinical reasoning AI."},
        {"role": "user", "content": prompt}
    ]

    messages = sanitize_obj(messages)

    try:
        # ========== OpenAI Call ==========
        resp = client.chat.completions.create(
            model=os.getenv("LLM_MODEL", "openrouter/free"),
            messages=messages,
            max_tokens=400,
            timeout=30
        )

        # ========== Clean Output ==========
        out_text = resp.choices[0].message.content or ""

        # --- Remove markdown code fences like ```json ... ``` ---
        text = re.sub(r"^```(?:json)?", "", out_text, flags=re.IGNORECASE).strip("` \n")
        text = re.sub(r"```$", "", text).strip()

        # Try parse JSON if model included it
        try:
            j = json.loads(text)
            result = j.get("result") or j.get("Result") or text
        except Exception:
            result = text

        if not result or not result.strip():
            fallback = deterministic_summary(agentR_result, agentD_result, score, level)
            result = fallback

        # Sanitize and output clean text only
        result = sanitize_string(result).strip()
        safe_json_output({"result": result})

    except APIError as e:
        tb = traceback.format_exc()
        fallback = deterministic_summary(agentR_result, agentD_result, score, level)
        safe_json_output({"error": "openai_api_error", "details": str(e), "traceback": tb, "fallback_used": True, "fallback_result": fallback})
    except Exception as e:
        tb = traceback.format_exc()
        fallback = deterministic_summary(agentR_result, agentD_result, score, level)
        safe_json_output({"error": "unexpected_error", "details": str(e), "traceback": tb, "fallback_used": True, "fallback_result": fallback})


if __name__ == "__main__":
    main()
