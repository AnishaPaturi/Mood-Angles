with open("scratch/pdf_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

import re

# Find tables or performance metrics
# Let's search for keywords like "accuracy", "F1", "GPT-4", "Table"
keywords = ["GPT-4o", "Angel.R", "Angel.D", "Angel.C", "multi-Angels", "Table 1", "Table 2", "Table 3", "Table 4"]
for kw in keywords:
    matches = [m.start() for m in re.finditer(re.escape(kw), text)]
    print(f"Keyword '{kw}': {len(matches)} matches. First match preview:")
    if matches:
        start = max(0, matches[0] - 100)
        end = min(len(text), matches[0] + 200)
        print(text[start:end].replace('\n', ' [NL] '))
        print("-" * 50)
