import sys
import json
import os
from dotenv import load_dotenv

load_dotenv()

def main():
    """Read JSON from stdin and output a short, general diagnostic summary."""
    try:
        raw = sys.stdin.read()
    except Exception as e:
        print(json.dumps({"error": "stdin_read_error", "details": str(e)}))
        sys.exit(1)

    if not raw or raw.strip() == "":
        print(json.dumps({"error": "no_input", "details": "No data received"}))
        sys.exit(1)

    # Parse JSON safely
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": "invalid_json", "details": str(e)}))
        sys.exit(1)

    # Get condition name and score
    condition = str(data.get("condition", "the condition")).strip().title()
    try:
        score = float(data.get("score", 0))
    except Exception:
        score = 0

    # --- Generalized interpretation logic ---
    if score <= 19:
        summary = f"Low likelihood of {condition}"
    elif score <= 50:
        summary = f"Moderate likelihood of {condition}"
    elif score <= 74:
        summary = f"Some concern for {condition} — consider monitoring symptoms"
    elif score <= 86:
        summary = f"Significant expression of {condition}-related symptoms"
    else:
        summary = f"High likelihood of {condition}"

    # --- Add soft advice for clarity ---
    advice = (
        "Further evaluation by a qualified mental health professional is recommended "
        "to confirm findings and discuss next steps."
    )

    result = f"{summary}. {advice}"

    print(json.dumps({"result": result}))


if __name__ == "__main__":
    main()
