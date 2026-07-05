with open("scratch/pdf_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

import re

# Let's find pages or sections
pages = text.split("--- PAGE ")
print(f"Total pages in text file: {len(pages) - 1}")

# Search for the abstract and introduction
print("\n--- Abstract / Intro start ---")
print(text[:3000])

# Search for the main headings and print their locations
sections = [
    "Abstract",
    "1 Introduction",
    "2 Retrieval-augmented Multi-agent Framework",
    "2.1 Granular-scale Analysis",
    "2.2 Retrieval Datastore",
    "2.3 Diagnostic Agents",
    "3 MoodSyn Dataset",
    "4 Experiment",
    "4.1 Experimental Settings",
    "4.2 Analysis of Experimental Results",
    "4.3 Ablation Study",
    "4.4 Case Study",
    "4.5 Error Analysis",
    "5 Conclusion",
    "References"
]

print("\n--- Section Offsets and Previews ---")
for sec in sections:
    pos = text.find(sec)
    if pos != -1:
        print(f"Section: '{sec}' found at character {pos}. Preview: {text[pos:pos+250]}...")
    else:
        print(f"Section: '{sec}' NOT found.")
