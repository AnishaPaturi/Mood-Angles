import sys

libs = ['pypdf', 'PyPDF2', 'pdfplumber', 'fitz', 'docx']
for lib in libs:
    try:
        __import__(lib)
        print(f"{lib}: available")
    except ImportError:
        print(f"{lib}: NOT available")
