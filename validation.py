# validation.py
"""
Small data-validation helpers for psychiatric dataset checks.
Each function returns a boolean summary or a DataFrame of problematic rows.
"""

from typing import List, Dict, Tuple
import pandas as pd

PHQ9_RANGE = (0, 27)
GAD7_RANGE = (0, 21)

def load_csv(path: str) -> pd.DataFrame:
    """Load CSV into pandas DataFrame."""
    return pd.read_csv(path)

def required_columns() -> List[str]:
    return [
        "age","gender",
        "phq9_score","phq9_label","phq9_symptoms","phq9_named_scores",
        "gad7_score","gad7_label","gad7_symptoms","gad7_named_scores",
        "narrative","family_history","treatment_history","recurrence","final_diagnosis"
    ]

def validate_schema(df: pd.DataFrame, required: List[str] = None) -> List[str]:
    """Return list of missing columns (empty list if OK)."""
    if required is None:
        required = required_columns()
    missing = [c for c in required if c not in df.columns]
    return missing

def check_numeric_ranges(df: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Return dict of DataFrames for rows out of allowed ranges."""
    out = {}
    if "age" in df.columns:
        age_ok_mask = df["age"].between(10, 100, inclusive="both")
        out["age_out_of_range"] = df.loc[~age_ok_mask]
    if "phq9_score" in df.columns:
        mask = df["phq9_score"].between(*PHQ9_RANGE, inclusive="both")
        out["phq9_out_of_range"] = df.loc[~mask]
    if "gad7_score" in df.columns:
        mask = df["gad7_score"].between(*GAD7_RANGE, inclusive="both")
        out["gad7_out_of_range"] = df.loc[~mask]
    return out

# Label mapping functions (standard cutoffs)
def phq9_label_from_score(score: int) -> str:
    if score <= 4: return "Minimal"
    if score <= 9: return "Mild"
    if score <= 14: return "Moderate"
    if score <= 19: return "Moderately Severe"
    return "Severe"

def gad7_label_from_score(score: int) -> str:
    if score <= 4: return "Minimal"
    if score <= 9: return "Mild"
    if score <= 14: return "Moderate"
    return "Severe"

def check_label_consistency(df: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Return mismatched rows where label != expected computed from score."""
    out = {}
    if {"phq9_score","phq9_label"}.issubset(df.columns):
        df_phq = df.copy()
        df_phq["_expected_phq9_label"] = df_phq["phq9_score"].apply(phq9_label_from_score)
        mism = df_phq[
            df_phq["_expected_phq9_label"].str.lower() != df_phq["phq9_label"].astype(str).str.lower()
        ]
        out["phq9_label_mismatches"] = mism.drop(columns=["_expected_phq9_label"])
    if {"gad7_score","gad7_label"}.issubset(df.columns):
        df_gad = df.copy()
        df_gad["_expected_gad7_label"] = df_gad["gad7_score"].apply(gad7_label_from_score)
        mism = df_gad[
            df_gad["_expected_gad7_label"].str.lower() != df_gad["gad7_label"].astype(str).str.lower()
        ]
        out["gad7_label_mismatches"] = mism.drop(columns=["_expected_gad7_label"])
    return out

def find_duplicates(df: pd.DataFrame, subset: List[str] = None) -> pd.DataFrame:
    """Return rows that are duplicated (keep all duplicates). If subset None, use all cols."""
    return df[df.duplicated(subset=subset, keep=False)]

def missing_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Return DataFrame with missing counts and % missing per column."""
    s = df.isna().sum()
    return pd.DataFrame({
        "missing_count": s,
        "missing_percent": (s / len(df) * 100).round(2)
    })

def unexpected_values(df: pd.DataFrame, column: str, allowed: List[str], case_insensitive: bool = True):
    """Return rows whose column value is outside the allowed set."""
    if column not in df.columns:
        return df.head(0)
    series = df[column].astype(str).str.strip()
    if case_insensitive:
        allowed_set = set([a.lower() for a in allowed])
        mask = ~series.str.lower().isin(allowed_set)
    else:
        allowed_set = set(allowed)
        mask = ~series.isin(allowed_set)
    return df.loc[mask]

def text_quality_issues(df: pd.DataFrame, columns: List[str], min_tokens: int = 3) -> pd.DataFrame:
    """Return rows where any of the text columns have extremely short/empty tokens."""
    problem_idx = set()
    for c in columns:
        if c not in df.columns: continue
        token_counts = df[c].astype(str).str.split().apply(len)
        problem_idx.update(df.loc[token_counts < min_tokens].index.tolist())
    return df.loc[sorted(problem_idx)]

def run_all_checks(path: str) -> Dict[str, object]:
    """Convenience wrapper: run a set of checks and return a dict of results."""
    df = load_csv(path)
    results = {}
    results["missing_columns"] = validate_schema(df)
    results["range_issues"] = check_numeric_ranges(df)
    results["label_mismatches"] = check_label_consistency(df)
    results["duplicates"] = find_duplicates(df)
    results["missing_summary"] = missing_summary(df)
    results["unexpected_gender"] = unexpected_values(
        df, "gender",
        allowed=["male","female","other","non-binary","nonbinary","prefer not to say","na"]
    )
    results["text_issues"] = text_quality_issues(df, ["narrative","family_history","treatment_history"], min_tokens=4)
    # add final diag distribution
    if "final_diagnosis" in df.columns:
        results["diagnosis_counts"] = df["final_diagnosis"].value_counts(dropna=False).to_dict()
    return results

def class_balance(df: pd.DataFrame, column: str = "final_diagnosis") -> pd.DataFrame:
    """Return distribution of classes and percentage representation."""
    if column not in df.columns:
        return pd.DataFrame()
    counts = df[column].value_counts(dropna=False)
    perc = (counts / len(df) * 100).round(2)
    return pd.DataFrame({"count": counts, "percent": perc})

def score_distribution(df: pd.DataFrame, score_col: str) -> Dict[str, float]:
    """Return basic distribution stats for score columns."""
    if score_col not in df.columns:
        return {}
    series = df[score_col].dropna()
    return {
        "min": float(series.min()),
        "max": float(series.max()),
        "mean": float(series.mean().round(2)),
        "std": float(series.std().round(2))
    }

def demographic_balance(df: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    """Return distribution of genders and ages (bucketed)."""
    out = {}
    if "gender" in df.columns:
        g_counts = df["gender"].value_counts(dropna=False)
        g_perc = (g_counts / len(df) * 100).round(2)
        out["gender"] = pd.DataFrame({"count": g_counts, "percent": g_perc})
    if "age" in df.columns:
        bins = [0, 18, 25, 35, 50, 65, 100]
        labels = ["<18", "18-25", "26-35", "36-50", "51-65", "65+"]
        age_binned = pd.cut(df["age"], bins=bins, labels=labels, right=True)
        a_counts = age_binned.value_counts(sort=False)
        a_perc = (a_counts / len(df) * 100).round(2)
        out["age"] = pd.DataFrame({"count": a_counts, "percent": a_perc})
    return out

def text_field_quality(df: pd.DataFrame, columns: List[str]) -> pd.DataFrame:
    """Check average length of text fields in tokens (words)."""
    results = []
    for c in columns:
        if c not in df.columns:
            continue
        tokens = df[c].astype(str).str.split()
        avg_len = tokens.apply(len).mean().round(2)
        short_rows = (tokens.apply(len) < 5).sum()
        results.append({"column": c, "avg_tokens": avg_len, "rows_too_short": int(short_rows)})
    return pd.DataFrame(results)

