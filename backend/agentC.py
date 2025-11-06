#!/usr/bin/env python3
# agentC.py  — comparative analysis (Agent.C)

import sys
import json
import os
import traceback
from dotenv import load_dotenv
from openai import OpenAI, APIError

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def safe_read_stdin():
    raw = sys.stdin.read()
    try:
        return json.loads(raw)
    except Exception as e:
        print(json.dumps({"error": "invalid_json", "details": str(e)}))
        sys.exit(1)

def make_retrieval_placeholder(answers, score, level, medical_record):
    """
    Placeholder retrieval: in production replace with your vector DB retriever that returns
    top-5 similar historical cases (each case = dict with keys: id, summary, similarity_score).
    """
    # Simple mock: return empty list or a tiny synthetic example to let LLM compare.
    return [
        {
            "id": "case_001",
            "summary": "35yo, episodic elevated mood and decreased need for sleep; had severe impulsive spending. Clinician: bipolar diagnosed.",
            "similarity": 0.87
        },
        {
            "id": "case_042",
            "summary": "50yo, chronic low mood, insomnia; clinician: major depressive disorder.",
            "similarity": 0.72
        }
    ]

def build_prompt(current, retrieved_cases):
    sr = "\n\n".join([f"Case {i+1} (sim={c.get('similarity')}): {c.get('summary')}" for i,c in enumerate(retrieved_cases)])
    prompt = f"""
You are Agent.C, a comparative diagnostic analyst. You will compare the CURRENT CASE with the TOP-RETRIEVED HISTORICAL CASES and summarize how similar/different patterns affect the diagnostic judgement.

CURRENT CASE:
- numeric score: {current.get('score')}
- level interpretation: {current.get('level')}
- medical record (if any): {current.get('medicalRecord') or 'N/A'}
- answers summary: {current.get('answers_summary') or 'N/A'}

RETRIEVED CASES:
{sr}

TASK:
1) Produce a concise 2-4 sentence analysis that:
   - explains how the retrieved cases are similar or different vs the current case;
   - indicates whether the similarities support or undermine a mood-disorder diagnosis for the current visitor;
   - suggest any caution or next-step (e.g., need for clinician review or further data).
2) Output plain text only (no JSON wrappers).

Be factual, non-alarming, and concise.
"""
    return prompt

def main():
    data = safe_read_stdin()
    # Expect keys: answers (dict or whatever), score (int), level (string), medicalRecord (optional)
    try:
        current = {
            "answers": data.get("answers"),
            "score": data.get("score"),
            "level": data.get("level"),
            "medicalRecord": data.get("medicalRecord"),
            # Compose a compact answers summary so model sees readable text:
            "answers_summary": "\n".join([f"{k}: {v}" for k,v in (data.get("answers") or {}).items()])[:2000]
        }

        # Do retrieval (replace this with your real retriever)
        retrieved_cases = make_retrieval_placeholder(current["answers"], current["score"], current["level"], current["medicalRecord"])

        prompt = build_prompt(current, retrieved_cases)

        resp = client.responses.create(
            model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
            input=[
                {"role":"system", "content":"You are Agent.C, comparative analysis expert."},
                {"role":"user", "content": prompt}
            ],
            max_output_tokens=300
        )

        out_text = getattr(resp, "output_text", None)
        if not out_text:
            # fallback to parsing response object
            try:
                respdict = resp.to_dict() if hasattr(resp, "to_dict") else dict(resp)
                out_text = respdict.get("output_text") or str(respdict)
            except Exception:
                out_text = str(resp)

        result_text = (out_text or "").strip()
        if not result_text:
            print(json.dumps({"error":"no_output_text","raw_preview":str(resp)[:2000]}))
            return

        print(json.dumps({"result": result_text}))
    except APIError as e:
        traceback.print_exc(file=sys.stderr)
        print(json.dumps({"error":"openai_api_error","details":str(e)}))
    except Exception as e:
        traceback.print_exc(file=sys.stderr)
        print(json.dumps({"error":"unexpected_error","details":str(e)}))

if __name__ == "__main__":
    main()
