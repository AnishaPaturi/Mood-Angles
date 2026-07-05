import re

with open("scratch/pdf_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Look for standard paper sections in the text
lines = text.split("\n")
headings = []
for line in lines:
    line_strip = line.strip()
    if re.match(r'^(?:[1-9]\d*|Introduction|Abstract|Method|Experiment|Related Work|Conclusion|Discussion|References)\b', line_strip):
        if len(line_strip) < 100:
            headings.append(line_strip)

print("Found headings/potential sections:")
for h in headings[:40]:
    print(h)
