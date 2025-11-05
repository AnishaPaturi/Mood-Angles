# #!/usr/bin/env python3
# # agentR.py  (overwrite the broken file with this)

# import sys
# import json
# import os
# from dotenv import load_dotenv
# from openai import OpenAI, APIError

# load_dotenv()
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# def extract_text_from_response(resp):
#     """
#     Extract plain text from a Responses API return value.
#     Returns a string or None.
#     """
#     # 1) attribute convenience
#     try:
#         out = getattr(resp, "output_text", None)
#         if out:
#             return out.strip()
#     except Exception:
#         pass

#     # 2) dict-like output_text
#     try:
#         if isinstance(resp, dict) and resp.get("output_text"):
#             return str(resp.get("output_text")).strip()
#     except Exception:
#         pass

#     # 3) .to_dict() if available
#     resp_dict = None
#     try:
#         if hasattr(resp, "to_dict"):
#             d = resp.to_dict()
#             if isinstance(d, dict) and d.get("output_text"):
#                 return str(d["output_text"]).strip()
#             resp_dict = d
#         elif isinstance(resp, dict):
#             resp_dict = resp
#     except Exception:
#         resp_dict = None

#     # 4) Walk common resp_dict['output'] shapes
#     def collect_from_output(obj):
#         pieces = []
#         if not obj:
#             return pieces
#         if isinstance(obj, (list, tuple)):
#             for itm in obj:
#                 if isinstance(itm, dict):
#                     content = itm.get("content")
#                     if content and isinstance(content, (list, tuple)):
#                         for frag in content:
#                             if isinstance(frag, dict):
#                                 txt = frag.get("text")
#                                 if txt and isinstance(txt, str):
#                                     pieces.append(txt)
#                                 else:
#                                     for v in frag.values():
#                                         if isinstance(v, str):
#                                             pieces.append(v)
#                                             break
#                     else:
#                         txt = itm.get("text")
#                         if txt and isinstance(txt, str):
#                             pieces.append(txt)
#         return pieces

#     try:
#         if resp_dict:
#             pieces = collect_from_output(resp_dict.get("output"))
#             if pieces:
#                 return "\n".join(pieces).strip()
#     except Exception:
#         pass

#     # 5) Last-ditch: stringify
#     try:
#         s = str(resp)
#         if len(s) < 20000 and any(c.isalpha() for c in s):
#             return s.strip()
#     except Exception:
#         pass

#     return None


# def main():
#     raw = sys.stdin.read()
#     try:
#         data = json.loads(raw)
#     except json.JSONDecodeError:
#         print(json.dumps({"error": "invalid_json_on_stdin"}))
#         return

#     answers = data.get("answers", {})
#     if not isinstance(answers, dict) or len(answers) == 0:
#         print(json.dumps({"error": "no_answers_or_wrong_format"}))
#         return

#     formatted = "\n".join([f"{k}: {v}" for k, v in answers.items()])

#     try:
#         resp = client.responses.create(
#             model=os.getenv("LLM_MODEL", "gpt-4o"),
#             input=[
#                 {"role": "system", "content": "You are Agent R, a diagnostic assistant for mood disorders."},
#                 {"role": "user", "content": f"Analyze these responses and provide a short diagnostic summary:\n{formatted}"}
#             ],
#             max_output_tokens=800
#         )
#     except APIError as e:
#         print(json.dumps({"error": "openai_api_error", "details": str(e)}))
#         return
#     except Exception as e:
#         print(json.dumps({"error": "unexpected_error", "details": str(e)}))
#         return

#     try:
#         out_text = extract_text_from_response(resp)
#         if not out_text:
#             # safe short dump for debugging
#             try:
#                 raw_dump = resp.to_dict() if hasattr(resp, "to_dict") else (resp if isinstance(resp, dict) else None)
#             except Exception:
#                 raw_dump = None
#             short_raw = json.dumps(raw_dump, default=str)[:2000] if raw_dump is not None else str(resp)[:2000]
#             print(json.dumps({"error": "no_output_text", "raw_preview": short_raw}))
#             return

#         # final successful JSON output
#         print(json.dumps({"result": out_text}))
#     except Exception as e:
#         try:
#             preview = resp.to_dict() if hasattr(resp, "to_dict") else (resp if isinstance(resp, dict) else None)
#             preview_short = json.dumps(preview, default=str)[:2000]
#         except Exception:
#             preview_short = str(resp)[:2000]
#         print(json.dumps({"error": "parse_error", "details": str(e), "raw_preview": preview_short}))


# if __name__ == "__main__":
#     main()


#!/usr/bin/env python3
# agentR.py  — simplified single-line summary output

#!/usr/bin/env python3
# agentR.py  — deterministic mood-level classifier for Bipolar Test

import sys
import json
import os
from dotenv import load_dotenv

load_dotenv()

def main():
    """Read JSON from stdin and output a single short diagnostic sentence."""
    try:
        raw = sys.stdin.read()
    except Exception as e:
        print(json.dumps({"error": "stdin_read_error", "details": str(e)}))
        sys.exit(1)

    if not raw or raw.strip() == "":
        print(json.dumps({"error": "no_input", "details": "No data received"}))
        sys.exit(1)

    # Parse JSON
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": "invalid_json", "details": str(e)}))
        sys.exit(1)

    # Get score (from frontend)
    score = float(data.get("score", 0))

    # -------- Deterministic match-the-following logic --------
    if score <= 19:
        summary = "Low chance of Bipolar Disorder"
    elif score <= 50:
        summary = "Moderate chance of Bipolar Disorder"
    elif score <= 74:
        summary = "Some concern for Bipolar Disorder"
    elif score <= 86:
        summary = "Significant Behavioral Dysregulation"
    else:
        summary = "High likelihood of Bipolar Disorder"

    # Return as JSON
    print(json.dumps({"result": summary}))


if __name__ == "__main__":
    main()
