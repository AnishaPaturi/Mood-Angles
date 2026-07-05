with open("scratch/pdf_text.txt", "r", encoding="utf-8") as f:
    text = f.read()

def show_section(title, next_title=None, chars=3000):
    pos = text.find(title)
    if pos == -1:
        print(f"--- Title: '{title}' NOT found ---")
        return
    end_pos = len(text)
    if next_title:
        npos = text.find(next_title, pos + len(title))
        if npos != -1:
            end_pos = npos
    
    sec_text = text[pos:end_pos]
    print(f"\n=================== SECTION: {title} ===================")
    print(sec_text[:chars])
    if len(sec_text) > chars:
        print("... [TRUNCATED] ...")

# Show key sections of interest
show_section("2 Retrieval-augmented Multi-agent Framework", "3 MoodSyn Dataset", 5000)
show_section("3 MoodSyn Dataset", "4 Experiment", 3000)
show_section("2.3 Diagnostic Agents", "3 MoodSyn Dataset", 4000)
