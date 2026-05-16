#!/usr/bin/env python3
"""
Extract text from PDF and image files using pdfplumber and pytesseract.
Usage: python extract_text.py <filepath>
"""
import sys
import os

def extract_text(filepath):
    ext = os.path.splitext(filepath)[1].lower()

    try:
        if ext == '.pdf':
            import pdfplumber
            text = ""
            with pdfplumber.open(filepath) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or "" + "\n"
            return text.strip()
        elif ext in ['.png', '.jpg', '.jpeg']:
            import pytesseract
            from PIL import Image
            img = Image.open(filepath)
            return pytesseract.image_to_string(img).strip()
        elif ext == '.docx':
            from docx import Document
            doc = Document(filepath)
            return "\n".join([p.text for p in doc.paragraphs]).strip()
        else:
            return "Unsupported file type"
    except ImportError as e:
        missing = str(e)
        if "pytesseract" in missing or "TesseractNotFoundError" in missing or "tesseract" in missing.lower():
            print(f"OCR_ERROR: Tesseract is not installed or not in PATH. Install it from https://github.com/tesseract-ocr/tesseract", file=sys.stdout)
            sys.exit(0)
        print(f"Missing library: {missing}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        err_msg = str(e)
        if "tesseract" in err_msg.lower() or "TesseractNotFoundError" in err_msg:
            print(f"OCR_ERROR: Tesseract is not installed or not in PATH. Install it from https://github.com/tesseract-ocr/tesseract", file=sys.stdout)
            sys.exit(0)
        print(f"Error extracting text: {err_msg}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_text.py <filepath>", file=sys.stderr)
        sys.exit(1)
    print(extract_text(sys.argv[1]))