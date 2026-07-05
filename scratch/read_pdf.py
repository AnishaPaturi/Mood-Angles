import pypdf

reader = pypdf.PdfReader("Moodangels.pdf")
num_pages = len(reader.pages)
print(f"Total pages: {num_pages}")

full_text = []
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    full_text.append(f"--- PAGE {i+1} ---\n{text}")

with open("scratch/pdf_text.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(full_text))

print("PDF text extracted to scratch/pdf_text.txt successfully.")
print("\nFirst 2000 characters of extracted text:")
print("\n".join(full_text)[:2000])
