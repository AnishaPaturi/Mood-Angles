#!/usr/bin/env python3
"""
RAG ingestion scripts — stores DSM-5 + clinical cases as plain-text document chunks
in MongoDB via the Node backend.  Embeddings are computed on-demand at query time
by the server using langchain/OpenAIEmbeddings, so no API credits are consumed here.

Usage:  python data/ingest_rag_data.py [dsm5 | cases | both]
"""

import json, os, sys, time, csv, urllib.request
from pathlib import Path
from typing import Any, Dict, List

# ──────────────────────────────────
#  Paths / Config
# ──────────────────────────────────
BASE        = Path(__file__).parent          # data/
DSM5_JSON   = BASE / "dsm5_knowledge.json"
DATASET_CSV = BASE.parent / "DataSet.csv"
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

CHUNK_SIZE    = 950
CHUNK_OVERLAP = 100
WRITE_PAGE    = 50           # MongoDB write batch size (avoid HTTP 413)

CACHE_DIR = BASE / "_cache"
CACHE_DIR.mkdir(exist_ok=True)


# ──────────────────────────────────
#  HTTP helper
# ──────────────────────────────────

def http_post(url: str, payload: dict, timeout: int = 60) -> dict:
    body = json.dumps(payload).encode("utf-8")
    req  = urllib.request.Request(
        url, data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


# ──────────────────────────────────
#  Text splitter
# ──────────────────────────────────

def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    out: List[str] = []
    start = 0
    while start < len(text):
        end = min(start + size, len(text))
        out.append(text[start:end])
        start = end - overlap if end < len(text) else end
    return out


# ──────────────────────────────────
#  ── DSM-5 KNOWLEDGE BASE ───────
# ──────────────────────────────────

def flatten_criteria(entry: Dict) -> List[str]:
    lines: List[str] = []
    name     = entry.get("name",     "Unknown")
    category = entry.get("category", "Uncategorised")
    entry_id = entry.get("id",       "")

    lines.append(f"[{name}] Category: {category}  (id:{entry_id})")

    crit = entry.get("diagnostic_criteria", {}) or {}
    if isinstance(crit, dict):
        for k in sorted(crit.keys()):
            v = crit[k]
            if isinstance(v, (str, int, float)):
                lines.append(f"  Criterion {k}: {v}")
            elif isinstance(v, dict):
                lines.append(f"  Criterion {k}:")
                for kk, vv in v.items():
                    lines.append(f"    - {kk}: {vv}")
            elif isinstance(v, list):
                lines.append(f"  {k}:")
                for item in v:
                    if isinstance(item, dict):
                        lines.append(f"    * {item.get('name','')}: {item.get('description','')}")
                    else:
                        lines.append(f"    * {item}")
            elif v:
                lines.append(f"  {k}: {str(v)[:500]}")
    elif isinstance(crit, str) and crit.strip():
        lines.append(f"  Criteria: {crit[:500]}")

    # Symptoms — list of dicts or list of strings
    for s in entry.get("symptoms", []):
        if isinstance(s, dict):
            lines.append(f"  Symptom {s.get('number','')}: {s.get('name','')} — {s.get('description','')}")
        else:
            lines.append(f"  Symptom: {s}")

    # Symptom groups & specifiers
    groups = entry.get("symptom_groups", [])
    if groups:
        lines.append(f"  Symptom groups: {', '.join(groups)}")

    specs = entry.get("specifiers", [])
    if specs:
        lines.append(f"  Specifiers: {', '.join(specs)}")

    return lines


def build_dsm5_entries() -> List[Dict]:
    if not DSM5_JSON.exists():
        sys.exit(f"*  {DSM5_JSON} not found.")
    entries = json.loads(DSM5_JSON.read_text(encoding="utf-8"))
    results: List[Dict] = []
    for entry in entries:
        lines     = flatten_criteria(entry)
        flat_text = "\n".join(lines)
        meta = {
            "source":   "dsm5_knowledge",
            "entry_id": str(entry.get("id", "")),
            "name":     str(entry.get("name", "")),
            "category": str(entry.get("category", "")),
            "type":     "dsm5_criteria",
        }
        results.append({ "text": flat_text, "meta": meta })
    return results


def ingest_dsm5() -> None:
    items = build_dsm5_entries()
    print(f"[dsm5]  {len(items)} entries …", flush=True)

    all_chunks: List[Dict] = []
    for item in items:
        meta     = item["meta"].copy()
        chunks   = chunk_text(item["text"])
        for i, ct in enumerate(chunks):
            all_chunks.append({
                "content":     ct,
                "embedding":   [],       # text-only; embedding computed at query time
                "metadata":    { **meta, "chunk_index": i },
                "source":      "dsm5_knowledge",
                "chunk_index": i,
            })
        print(f"  --> {meta['name']}  -> {len(chunks)} chunk(s)")

    write_backend(all_chunks, "dsm5")


# ──────────────────────────────────
#  ── CLINICAL CASES ──────────────
# ──────────────────────────────────

def build_case_entries(path: Path = DATASET_CSV) -> List[Dict]:
    if not path.exists():
        sys.exit(f"*  DataSet.csv not found at {path}")
    items: List[Dict] = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            parts: List[str] = [
                f"CASE {row.get('case_id','?')}",
                f"Age={row.get('age','?')}  Sex={row.get('sex','?')}",
                f"Education: {row.get('education','?')}",
                f"Primary Diagnosis: {row.get('primary_diagnosis','?')}",
                f"Final Labelled Diagnosis: {row.get('final_diagnosis','?')}",
                f"Comorbidities: {row.get('comorbidities','none') or 'none'}",
                f"Narrative: {(row.get('narrative','') or '').strip()}",
                f"Medications: {(row.get('medication_history','') or 'none') or 'none'}",
                f"Treatment: {(row.get('treatment_history','') or 'none') or 'none'}",
                f"Family Hx: {(row.get('family_history','') or 'none') or 'none'}",
            ]
            for scale in ["phq9_total","gad7_total","asrs_total","aq_total","msi_total","mdq_total","npi_total","lsrp_total"]:
                v = row.get(scale, "")
                if v:
                    try:                parts.append(f"{scale}: {int(float(v))}")
                    except Exception:   parts.append(f"{scale}: {v}")
            items.append({
                "text": "\n".join(parts),
                "meta": {
                    "source":            "DataSet.csv",
                    "type":              "clinical_case",
                    "case_id":           row.get("case_id", ""),
                    "primary_diagnosis": row.get("primary_diagnosis", ""),
                    "final_diagnosis":   row.get("final_diagnosis",   ""),
                    "comorbidities":     row.get("comorbidities",     ""),
                },
            })
    return items


def ingest_cases(path: Path = DATASET_CSV) -> None:
    items = build_case_entries(path)
    print(f"[cases]  {len(items)} cases …", flush=True)

    all_chunks: List[Dict] = []
    for item in items:
        all_chunks.append({
            "content":     item["text"],
            "embedding":   [],
            "metadata":    { **item["meta"], "chunk_index": 0 },
            "source":      "DataSet.csv",
            "chunk_index": 0,
        })

    write_backend(all_chunks, "clinical_case")


# ──────────────────────────────────
#  Shared: write via HTTP to backend
# ──────────────────────────────────

def write_backend(chunks: List[Dict], type_: str) -> None:
    url = f"{BACKEND_URL}/api/admin/rag-batch"
    PAGE = WRITE_PAGE
    total = 0
    for page in range(0, len(chunks), PAGE):
        batch = chunks[page:page + PAGE]
        try:
            resp = http_post(url, { "chunks": batch, "type": type_ })
            n    = resp.get("stored", len(batch)) if isinstance(resp, dict) else len(batch)
            total += n
            print(f"  --> page {page}-{page+len(batch)-1}   stored={n}", flush=True)
        except Exception as exc:
            print(f"  --> page {page}   ERR: {exc}", file=sys.stderr)
        time.sleep(0.2)
    print(f"[{type_:<16}]  *  {total} chunks written to MongoDB.", flush=True)


# ──────────────────────────────────
#  CLI
# ──────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python data/ingest_rag_data.py [dsm5 | cases | both]")
        sys.exit(1)
    mode = sys.argv[1].lower()
    if   mode == "dsm5":  ingest_dsm5()
    elif mode == "cases": ingest_cases()
    elif mode == "both":  ingest_dsm5();  time.sleep(1);  ingest_cases()
    else:
        print(f"Unknown mode: {mode}\nUsage: python data/ingest_rag_data.py [dsm5 | cases | both]")
        sys.exit(1)
