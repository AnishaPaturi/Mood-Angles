#!/usr/bin/env python3
# agentJ.py — Judge agent: produce a clinical diagnosis-style decision (NO references to other agents)

import sys
import json
import os
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

def sanitize_string(s: str) -> str:
    if not isinstance(s, str):
        return s
    out = []
    for ch in s:
        cp = ord(ch)
        # replace lone surrogates with replacement char
        if 0xD800 <= cp <= 0xDFFF:
            out.append("\uFFFD")
        else:
            out.append(ch)
    return "".join(out)

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

def deterministic_judgment(score, condition):
    s = float(score) if score else 0
    cond_lower = (condition or "").lower()
    
    # Determine urgency based on score (0-100 scale)
    if s <= 19:
        decision = "Unlikely"
        conf = 0.2
        urgency = "low"
        timeline = "Routine screening"
    elif s <= 50:
        decision = "Possible"
        conf = 0.5
        urgency = "medium"
        timeline = "Within 1-2 months"
    elif s <= 74:
        decision = "Possible"
        conf = 0.7
        urgency = "medium-high"
        timeline = "Within 2-4 weeks"
    elif s <= 86:
        decision = "Likely"
        conf = 0.85
        urgency = "high"
        timeline = "Within 1-2 weeks"
    else:
        decision = "Likely"
        conf = 0.95
        urgency = "urgent"
        timeline = "Within days"
    
    # Condition-specific suggestions based on symptom patterns
    baseline_actions = []
    
    if "autism" in cond_lower or "adhd" in cond_lower:
        baseline_actions = [
            "Track routines and sensory triggers in a daily journal",
            "Practice scripts for social situations",
            "Consider screening tools like AQ-50 or RAADS-R"
        ]
        if urgency in ["medium-high", "high", "urgent"]:
            baseline_actions.append("Ask your doctor about neuropsychological evaluation")
    elif "anxiety" in cond_lower:
        baseline_actions = [
            "Practice 4-7-8 breathing for 5 minutes twice daily",
            "Limit caffeine and alcohol",
            "Use grounding techniques: name 5 things you see, 4 you hear, 3 you touch"
        ]
        if urgency in ["high", "urgent"]:
            baseline_actions.append("Tell your doctor: 'I have persistent worry affecting daily life'")
    elif "depress" in cond_lower:
        baseline_actions = [
            "Set one small achievable goal each day",
            "Get 15 minutes of sunlight and movement",
            "Create a safety plan with trusted contacts"
        ]
        if urgency in ["high", "urgent"]:
            baseline_actions.append("Tell your doctor: 'I need help with persistent low mood and energy'")
    elif "bipolar" in cond_lower:
        baseline_actions = [
            "Track mood daily using a simple 1-10 scale",
            "Maintain consistent sleep schedule",
            "Avoid stimulants and sudden schedule changes"
        ]
        if urgency in ["high", "urgent"]:
            baseline_actions.append("Tell your doctor: 'I notice mood swings between highs and lows'")
    else:
        baseline_actions = [
            "Keep a simple daily log of your experiences",
            "Note patterns in your energy and mood",
            "Bring this log to your healthcare appointment"
        ]
    
    # Add timing context to actions
    timing_note = {
        "low": " (long-term self-monitoring)",
        "medium": " (routine follow-up)",
        "medium-high": " (sooner rather than later)",
        "high": " (within 1-2 weeks)",
        "urgent": " (as soon as possible)"
    }
    
    return {
        "decision": decision,
        "confidence": conf,
        "reasoning": f"Based on score {s}, the condition {condition or 'observed'} shows {decision.lower()} presentation with {urgency} urgency.",
        "actions": baseline_actions,
        "final_call": f"Assessment: {decision}. Urgency: {timeline}.",
        "urgency": urgency,
        "timeline": timeline,
        "timing_note": timing_note.get(urgency, "")
    }

def build_clinical_context(data):
    """Return a short plain-text clinical context summarizing score, level, condition, family history, and key responses."""
    score = data.get("score")
    level = data.get("level", "")
    condition = data.get("condition", "")
    answers = data.get("answers", {})
    highlights = []
    if isinstance(answers, dict):
        for k, v in list(answers.items())[:50]:
            try:
                if isinstance(v, str) and "→ Answer:" in v:
                    parts = v.split("→ Answer:")
                    q_text = parts[0].strip()
                    a_text = parts[1].strip()
                    highlights.append(f"{q_text} — {a_text}")
                else:
                    highlights.append(f"{k}: {v}")
            except Exception:
                highlights.append(f"{k}: {v}")
    if not highlights:
        highlights_text = "No symptom detail provided."
    else:
        highlights_text = "\n".join(highlights[:7])
    ctx = f"Condition (if known): {condition}\nNumeric score: {score}\nLevel: {level}\nKey self-report highlights:\n{highlights_text}"
    return ctx

def main():
    try:
        raw = sys.stdin.read()
        data = json.loads(raw or "{}")
    except Exception as e:
        safe_print_json({"error": "invalid_json", "details": str(e)})
        return

    # sanitize input fields
    data = sanitize_obj(data)

    # Use deterministic fallback if OpenAI unavailable or no API key
    if not OPENAI_AVAILABLE or not os.getenv("OPENAI_API_KEY"):
        fallback = deterministic_judgment(data.get("score"), data.get("condition", ""))
        safe_print_json(fallback)
        return

# Build a clinical-only prompt (explicitly forbid referencing other agents)
    clinical_context = build_clinical_context(data)
    prompt = f"""
You are a clinical reasoning assistant producing a concise, medical-style diagnostic judgment.
Do NOT mention or refer to any other agent names, system internals, or tooling. Use only the clinical data (score, level, condition if provided, family history, and the patient's self-report highlights) to produce medical reasoning.

Context:
{clinical_context}

Task:
1) Give a short diagnostic decision label in plain language (one of: "Likely", "Possible", or "Unlikely"). 
   - Do NOT use "Insufficient evidence" or any wording that implies lack of information.

2) Provide a confidence score as a decimal between 0.0 and 1.0.

3) Explain the medical reasoning in 2–3 brief sentences.
   - The reasoning must be decisive.
   - You MUST NOT use phrases such as:
     "insufficient information", 
     "not enough data",
     "lack of symptoms",
     "lack of evidence",
     "cannot determine",
     "unclear",
     or any equivalent.
   - Always produce a clear, clinically grounded explanation using whatever information is available (score, level, symptoms, highlights).

4) Recommend 0–3 concrete next actions (short phrases) including self-help strategies BEFORE professional consultation. These should be specific to the condition:
   - Autism/ADHD: mention AQ-50, RAADS-R, tracking routines, social scripts
   - Anxiety: breathing exercises, grounding techniques, limiting stimulants
   - Depression: daily goals, sunlight/exercise, safety planning
   - Bipolar: mood tracking, sleep consistency, avoiding substance triggers

5) Include an "urgency" field: "low" (score 0-19), "medium" (20-50), "medium-high" (51-74), "high" (75-86), or "urgent" (87-100). THE URGENCY MUST MATCH THE SCORE.

6) Include a "timeline" field based on urgency: "Routine screening" (low), "Within 1-2 months" (medium), "Within 2-4 weeks" (medium-high), "Within 1-2 weeks" (high), "Within days" (urgent).

7) Produce a "final_call" field — a single sentence summarizing the overall judgment in simple clinical language.

Constraints:
- Output only valid JSON (no surrounding markdown, no extra text).
- JSON keys must be: decision, confidence, reasoning, actions, urgency, timeline, final_call.
- Keep reasoning clinical and non-alarmist.
- Do not say "ask another agent" or mention other agents.
- DO NOT imply insufficient information anywhere in the response.
- THE URGENCY MUST ALWAYS REFLECT THE SCORE - if score is 95+, use "urgent"
"""

    messages = [
        {"role": "system", "content": "You are a concise clinical diagnostician. Focus on medical reasoning only."},
        {"role": "user", "content": prompt}
    ]

    try:
        resp = client.chat.completions.create(
            model=os.getenv("LLM_MODEL", "openrouter/free"),
            messages=messages,
            max_tokens=300,
            timeout=30
        )

        out_text = resp.choices[0].message.content or ""
        text = out_text.strip()
        if text.startswith("```"):
            parts = text.split("\n")
            if parts[0].startswith("```"):
                parts = parts[1:]
            if parts and parts[-1].strip().startswith("```"):
                parts = parts[:-1]
            text = "\n".join(parts).strip()

        parsed = None
        try:
            parsed = json.loads(text) if text else None
        except Exception:
            parsed = None

        if not parsed or not isinstance(parsed, dict):
            fallback = deterministic_judgment(data.get("score"), data.get("condition", ""))
            parsed = fallback

        parsed = sanitize_obj(parsed)
        conf = parsed.get("confidence")
        try:
            if isinstance(conf, str):
                c = conf.strip().rstrip("%")
                parsed["confidence"] = max(0.0, min(1.0, float(c) / 100.0 if "%" in conf or float(c) > 1.0 else float(c)))
            elif isinstance(conf, (int, float)):
                val = float(conf)
                if val > 1.0:
                    parsed["confidence"] = max(0.0, min(1.0, val / 100.0))
                else:
                    parsed["confidence"] = max(0.0, min(1.0, val))
            else:
                parsed["confidence"] = 0.0
        except Exception:
            parsed["confidence"] = 0.0

        if "final_call" not in parsed:
            parsed["final_call"] = f"Final assessment: {parsed.get('decision', 'Possible')}."

        if "urgency" not in parsed or not parsed.get("urgency"):
            # Derive urgency from confidence
            conf_val = parsed.get("confidence", 0.5)
            if conf_val >= 0.9:
                parsed["urgency"] = "urgent"
            elif conf_val >= 0.8:
                parsed["urgency"] = "high"
            elif conf_val >= 0.6:
                parsed["urgency"] = "medium-high"
            elif conf_val >= 0.4:
                parsed["urgency"] = "medium"
            else:
                parsed["urgency"] = "low"

        # Validate/sanitize urgency to match known values
        valid_urgencies = ["low", "medium", "medium-high", "high", "urgent"]
        if parsed.get("urgency") not in valid_urgencies:
            conf_val = parsed.get("confidence", 0.5)
            if conf_val >= 0.9:
                parsed["urgency"] = "urgent"
            elif conf_val >= 0.8:
                parsed["urgency"] = "high"
            elif conf_val >= 0.6:
                parsed["urgency"] = "medium-high"
            elif conf_val >= 0.4:
                parsed["urgency"] = "medium"
            else:
                parsed["urgency"] = "low"

        # Set timeline based on urgency if not present or invalid
        if "timeline" not in parsed or not parsed.get("timeline"):
            urgency_to_timeline = {
                "urgent": "Within days",
                "high": "Within 1-2 weeks",
                "medium-high": "Within 2-4 weeks",
                "medium": "Within 1-2 months",
                "low": "Routine screening"
            }
            parsed["timeline"] = urgency_to_timeline.get(parsed.get("urgency", "medium"), "Within 1-2 months")

        # Ensure actions is always an array
        if "actions" in parsed and isinstance(parsed["actions"], str):
            parsed["actions"] = [a.strip() for a in parsed["actions"].split(";") if a.strip()]
        elif "actions" not in parsed:
            parsed["actions"] = deterministic_judgment(data.get("score"), data.get("condition", "")).get("actions", [])

        safe_print_json(parsed)

    except APIError as e:
        tb = traceback.format_exc()
        fallback = deterministic_judgment(data.get("score"), data.get("condition", ""))
        safe_print_json({"error": "openai_api_error", "details": str(e), "traceback": tb, "fallback_used": True, "fallback_result": fallback})
    except Exception as e:
        tb = traceback.format_exc()
        fallback = deterministic_judgment(data.get("score"), data.get("condition", ""))
        safe_print_json({"error": "unexpected_error", "details": str(e), "traceback": tb, "fallback_used": True, "fallback_result": fallback})

if __name__ == "__main__":
    main()
