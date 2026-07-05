import re

with open("scratch/pdf_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

lines = text.split("\n")
headings = []
for line in lines:
    line_strip = line.strip()
    # match number followed by space and uppercase letter or words
    if re.match(r'^(?:[1-9]\d*(?:\.[1-9]\d*)*|Abstract|Conclusion|Discussion|References|Appendix)\s+[A-Za-z]', line_strip):
        if len(line_strip) < 100:
            headings.append(line_strip)

with open("scratch/outline.txt", "w", encoding="utf-8") as out:
    for h in headings:
        out.write(h + "\n")

print(f"Outline written to scratch/outline.txt. Found {len(headings)} sections.")
print("Outline Sample:")
for h in headings[:30]:
    try:
        print(h)
    except Exception:
        print(h.encode('ascii', 'ignore').decode('ascii'))
