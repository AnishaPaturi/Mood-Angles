import re

with open("scratch/pdf_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's find sections around Table 1, Table 2, Table 3, Table 4, and Table 5 (if it exists)
with open("scratch/paper_tables.txt", "w", encoding="utf-8") as out:
    for i in range(1, 7):
        target = f"Table {i}"
        pos = 0
        while True:
            pos = text.find(target, pos)
            if pos == -1:
                break
            out.write(f"\n=================== FOUND {target} ===================\n")
            start = max(0, pos - 200)
            end = min(len(text), pos + 1200)
            out.write(text[start:end])
            out.write("\n----------------------------------------------------\n")
            pos += len(target)

print("Tables extracted to scratch/paper_tables.txt successfully.")
