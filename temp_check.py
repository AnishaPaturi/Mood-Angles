import pandas as pd
from validation import load_csv, check_label_consistency, phq9_label_from_score

df = load_csv('DataSet.csv')
mism = check_label_consistency(df)
phq_bad = mism.get('phq9_label_mismatches')
if phq_bad is not None and not phq_bad.empty:
    print(phq_bad[['phq9_score', 'phq9_label']].head(10))
    print('Expected for score 14:', phq9_label_from_score(14))
    print('Expected for score 15:', phq9_label_from_score(15))
    print('Expected for score 17:', phq9_label_from_score(17))
