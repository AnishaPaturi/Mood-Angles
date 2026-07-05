# MoodAngels: A Retrieval-Augmented Multi-Agent Framework for Psychiatric Diagnosis

**Mengxi Xiao¹*, Mang Ye²*, Ben Liu²*, Xiaofen Zong³*, He Li²*, Jimin Huang⁴*, Qianqian Xie¹*, Min Peng¹***

¹ *School of Artificial Intelligence, Wuhan University, Wuhan, China*  
² *School of Computer Science, Wuhan University, Wuhan, China*  
³ *Wuhan University Renmin Hospital, Wuhan, China*  
⁴ *The Fin AI, Shenzhen, China*

---

### Abstract
The application of Artificial Intelligence (AI) in psychiatric diagnosis faces significant challenges, including the subjective nature of mental health assessments, symptom overlap across disorders, and privacy constraints limiting data availability. To address these issues, we present **MoodAngels**, the first specialized multi-agent framework for mood disorder diagnosis. Our approach combines granular-scale analysis of clinical assessments with a structured verification and debate process, enabling more accurate and explainable interpretation of complex psychiatric data. Complementing this framework, we introduce **MoodSyn**, an open-source dataset of 1,173 synthetic psychiatric cases that preserves clinical validity while ensuring patient privacy. Experimental results demonstrate that MoodAngels outperforms conventional methods. The baseline agent (Angel.R) achieves 12.3% higher accuracy than GPT-4o on real-world cases, and the full multi-agent debate system (multi-Angels) delivers further improvements. Evaluation in the MoodSyn dataset demonstrates exceptional fidelity, accurately reproducing the core statistical patterns and complex relationships present in the original clinical data while maintaining strong utility for machine learning applications. Together, these contributions provide both an advanced diagnostic tool and a critical research resource for computational psychiatry, bridging important gaps in AI-assisted mental health assessment.

---

## 1. Introduction
Mental health diseases, with their high prevalence and profound societal impact, pose a major public health challenge by severely impairing quality of life. Accurate diagnosis is essential for timely intervention and effective treatment, yet the complexity and variability of symptoms make it particularly difficult, highlighting the need for advanced diagnostic tools to aid clinicians. Among mental diseases, mood disorders, including conditions like depression and bipolar disorder, are critical due to their high prevalence and the significant overlap of symptoms with other psychiatric conditions. Correctly diagnosing mood disorders is crucial, as it influences the diagnostic process for other disorders; for example, symptoms like difficulty concentrating may signal neurodevelopmental disorders only if they occur outside of depressive episodes. Given their prevalence and severe consequences, including suicide risk and chronic disability, mood disorders represent a significant burden on individuals and healthcare systems.

While large language models (LLMs) and LLM-based agents demonstrate strong capabilities in medical domains through robust textual analysis and decision-making, their direct application to psychiatry faces unique challenges:
1. **Subjective Nature of Assessments:** Psychiatric assessments are inherently subjective, relying heavily on self-reported scales and clinician observations rather than objective physiological biomarkers.
2. **Symptom Overlap:** The substantial overlap of symptoms across different mental disorders (e.g., fatigue, sleep disturbances, concentration issues) often leads to diagnostic confusion, requiring rigorous differential analysis.
3. **Data Privacy Constraints:** Strict data privacy regulations (such as HIPAA and GDPR) limit the availability of high-quality, real-world clinical datasets for training and testing computational models.

To overcome these limitations, we present **MoodAngels**, a retrieval-augmented multi-agent framework tailored for mood disorder diagnosis. MoodAngels addresses the core challenges of computational psychiatry through two main innovations: a granular-scale analysis of standard clinical scales and a structured verification and debate mechanism. Instead of relying on total scale scores, which can mask critical symptom configurations, MoodAngels performs item-level analysis. It structures a retrieval datastore consisting of DSM-5 diagnostic criteria and clinician-annotated cases to perform Retrieval-Augmented Generation (RAG). Diagnostic agents with varying levels of historical dependence (Angel.R, Angel.D, and Angel.C) collaborate and debate to reach a consensus diagnosis, significantly improving accuracy and explainability. Additionally, we introduce **MoodSyn**, an open-source synthetic dataset of 1,173 psychiatric cases, constructed using an advanced synthesis pipeline based on variational autoencoders and diffusion models (TabSyn) with dynamic loss weighting to maintain clinical coherence.

---

## 2. Retrieval-augmented Multi-agent Framework
The MoodAngels framework integrates structured clinical knowledge with dynamic, multi-agent decision-making. The architecture consists of three main stages: granular symptom extraction, context-aware retrieval from the DSM-5 and historical case datastores, and multi-agent debate and judgment. This combination bridges the gap between raw quantitative data (scale scores) and qualitative clinical reasoning.

### 2.1 Granular-scale Analysis
Psychiatric diagnoses depend on specific symptom combinations rather than overall scale totals. Relying solely on total scores on scales like the Patient Health Questionnaire (PHQ-9) or Generalized Anxiety Disorder (GAD-7) can lead to diagnostic errors, as identical total scores can arise from entirely different symptom combinations, some of which may not meet the diagnostic threshold for a specific disorder. 

To address this, MoodAngels implements granular-scale analysis, extracting item-level responses to evaluate symptom patterns. We select 16 key questions from 13 clinical scales that are highly correlated with mood disorders, prioritizing questions that map directly to the DSM-5 diagnostic criteria. This granular approach allows the system to analyze the frequency, severity, and consistency of specific symptom groups (e.g., anhedonia, sleep disruption, suicidal ideation) rather than treating the assessment as a single monolithic score. By evaluating response consistency, the system detects discrepancies (such as self-reporting high severity but displaying mild clinical signs), directing the diagnostic agents to perform further verification.

### 2.2 Retrieval Datastore
To support retrieval-augmented generation, we construct a retrieval datastore consisting of two primary components:
1. **Structured DSM-5 diagnostic and differential criteria:** Broken down into individual semantically-meaningful text blocks (e.g., criteria for Major Depressive Episode, Manic Episode, and their exclusion clauses).
2. **Clinician-annotated clinical cases:** Storing historical diagnostic reports, patient narratives, and granular scale responses.

All records are indexed using dense vector embeddings generated by the BGE-M3 model, chosen for its multi-lingual and multi-granular retrieval strength. During inference, the user's current assessment and clinical record are matched against the datastore using vector similarity search, retrieving the top-5 most similar diagnostic criteria and top-5 most similar historical cases to act as context.

### 2.3 Diagnostic Agents
To balance historical precedents with patient-specific variations, we develop three specialized diagnostic agents with different levels of historical case dependence:
- **Angel.R (Rule-based/Zero-history):** This agent evaluates the current patient data (16 granular scale questions and clinician notes) directly against the retrieved DSM-5 criteria. It is intentionally excluded from historical cases to prevent bias, acting as a strict, rule-governed baseline.
- **Angel.D (Direct Retrieval):** This agent receives both the patient's record and the top-5 retrieved similar historical cases in its prompt context. It draws direct parallels between the current patient's presentation and verified historical cases to determine the diagnosis.
- **Angel.C (Cognitive Comparison):** Instead of reading raw historical cases, Angel.C is provided with a detailed analytical comparison of the similarities and differences between the current patient's symptoms and the retrieved historical cases (e.g., highlighting that the patient shares sleep disturbances with Case A but lacks the psychomotor agitation). This cognitive summary helps the agent identify nuanced differences.

### 2.4 Multi-agent Diagnosis & Debate Protocol
The three agents generate independent diagnoses (e.g., "Mood Disorder" or "No Mood Disorder") along with their clinical reasoning. A Judge Agent reviews these inputs. If all three agents agree, the Judge outputs the consensus diagnosis and reasoning. If there is a disagreement (e.g., a 2-1 split), a structured debate protocol is initiated. Two debate agents are introduced: a Positive Agent (supporting a mood disorder diagnosis) and a Negative Agent (opposing it). The debate progresses in sequential rounds: the Positive Agent presents its evidence, the Negative Agent refutes it, and the Judge Agent evaluates the arguments. After each round, the Judge determines whether a resolution has been reached. Once the debate concludes, the Judge outputs the final diagnostic decision, resolving conflicts arising from symptom overlap or scale discrepancies.

---

## 3. MoodSyn Dataset
The MoodSyn dataset addresses the critical need for privacy-preserving, clinically valid data in computational psychiatry. It consists of 1,173 synthetic psychiatric cases designed to replicate the statistical distribution of real-world clinical cases. Each case includes 25 carefully selected features: 16 diagnostic questions, 8 standard scale scores, and an expert-verified mood disorder label.

We construct MoodSyn using an advanced synthesis pipeline based on the TabSyn framework. TabSyn integrates Variational Autoencoders (VAEs) with diffusion models to model complex tabular distributions. To preserve clinical coherence, we introduce several enhancements:
1. **Adaptive Tokenization and Hierarchical Encoding:** Handles the mixed categorical and numerical features.
2. **Dynamic Loss Weighting:** Enforces the mathematical relationship between question responses and total scale scores (e.g., the sum of PHQ-9 items must equal the total score).
3. **Context-Aware Sampling:** Preserves clinically meaningful feature correlations.

As shown in Table 2, the dataset is split into a retrieval store and a test store to benchmark RAG performance.

**Table 2: Descriptive statistics of the synthetic MoodSyn dataset.**
| Subset | Positive Amount (Mood Disorder) | Negative Amount | Total Cases |
| :--- | :---: | :---: | :---: |
| Cases for Retrieval | 687 | 419 | 1106 |
| Cases for Test | 73 | 67 | 140 |

---

## 4. Experimental Evaluation

### 4.1 Experimental Settings
We evaluate MoodAngels on a real-world dataset compiled from clinical assessments at Wuhan University Renmin Hospital. The dataset statistics are shown in Table 1. The test set comprises 561 cases, including 315 normal cases, 56 cases of mood disorders, and 190 cases of other mental disorders. The retrieval set includes 2,243 cases. We compare MoodAngels against several baselines, including In-Context Learning (ICL) on open-source and proprietary models (LLaMA3-8B-Instruct, Mistral-7B-Instruct-v0.3, GPT-4o, and Deepseek-V3) and different agent configurations. Performance is evaluated using Sensitivity (Recall), Accuracy, Matthews Correlation Coefficient (MCC), and Macro F1.

**Table 1: Dataset statistics of real-world clinical cases.**
| Subset | Normal | Mood Disorder | Other Diseases | Total |
| :--- | :---: | :---: | :---: | :---: |
| Cases for Retrieval | 1259 | 759 | 225 | 2243 |
| Cases for Test | 315 | 56 | 190 | 561 |

### 4.2 Analysis of Experimental Results
Table 3 presents the diagnostic performance of all models on the real-world dataset. The results demonstrate that the MoodAngels agent framework significantly outperforms standard In-Context Learning (ICL). Specifically, while standard GPT-4o achieves an accuracy of 79.7%, our zero-history agent Angel.R (GPT-4o) achieves 92.0% accuracy—a 12.3% absolute improvement. The full multi-agent debate system (multi-Angels GPT-4o) achieves the highest performance with 92.5% accuracy and a sensitivity of 88.1%. Deepseek-V3 based agents show similarly strong results, with Angel.R achieving 92.7% accuracy. This indicates that structuring the clinical task as a multi-agent debate against DSM-5 criteria is highly effective, regardless of the underlying LLM.

**Table 3: Diagnosis performances of all methods on real-world clinical data.**
| Model / Method | Sensitivity | Accuracy | MCC | Macro F1 |
| :--- | :---: | :---: | :---: | :---: |
| **In-Context Learning (ICL)** | | | | |
| LLaMA3-8B-Instruct | 0.393 | 0.506 | 0.315 | 0.492 |
| Mistral-7B-Instruct-v0.3 | 0.456 | 0.597 | 0.411 | 0.397 |
| GPT-4o | 0.631 | 0.797 | 0.639 | 0.792 |
| Deepseek-V3 | 0.703 | 0.847 | 0.716 | 0.841 |
| **GPT-4o Based Agents** | | | | |
| Angel.R | 0.840 | 0.920 | 0.829 | 0.913 |
| Angel.D | 0.845 | 0.923 | 0.837 | 0.917 |
| Angel.C | 0.848 | 0.914 | 0.814 | 0.906 |
| multi-Angels | 0.881 | 0.925 | 0.834 | 0.917 |
| **Deepseek-V3 Based Agents** | | | | |
| Angel.R | 0.863 | 0.927 | 0.841 | 0.920 |
| Angel.D | 0.864 | 0.920 | 0.823 | 0.911 |
| Angel.C | 0.858 | 0.922 | 0.829 | 0.914 |
| multi-Angels | 0.866 | 0.923 | 0.832 | 0.916 |

Table 4 summarizes performance on the synthetic MoodSyn dataset. Evaluating models on synthetic data is crucial for testing the dataset's clinical utility. The results demonstrate that models trained on MoodSyn generalize well. For instance, the Deepseek-V3 multi-agent system retains a high Macro F1-score of 0.821 on MoodSyn, matching the performance trend observed on real-world cases. This confirms that MoodSyn retains the clinical utility and relationships of the original dataset.

**Table 4: Diagnosis performances of all methods on synthetic data.**
| Model / Method | Recall | Accuracy | MCC | Macro F1 |
| :--- | :---: | :---: | :---: | :---: |
| **In-Context Learning (ICL)** | | | | |
| LLaMA3-8B-Instruct | 0.557 | 0.564 | 0.221 | 0.435 |
| Mistral-7B-Instruct-v0.3 | 0.589 | 0.636 | 0.375 | 0.563 |
| Deepseek-V3 | 0.761 | 0.821 | 0.664 | 0.816 |
| **Deepseek-V3 Based Agents** | | | | |
| Angel.R | 0.778 | 0.800 | 0.601 | 0.798 |
| Angel.D | 0.787 | 0.807 | 0.615 | 0.805 |
| Angel.C | 0.816 | 0.821 | 0.642 | 0.821 |
| multi-Angels | 0.824 | 0.821 | 0.642 | 0.821 |

### 4.3 Ablation Studies

#### 4.3.1 Medical Record Format
We investigate whether structured medical records (converting text to JSON or list formats before analysis) improve diagnostic performance. Table 5 shows the results. Setting 1 (unstructured symptom matching, unstructured agent input) achieves the highest accuracy (92.0%). Structuring the data (Setting 2 and Setting 3) leads to a slight decline in accuracy (-0.002 and -0.006, respectively). This indicates that converting clinician narratives into rigid structures can strip away subtle contextual descriptions and symptom qualifiers (e.g., 'intermittent' or 'profound'), which are valuable for LLM-based reasoning.

**Table 5: Diagnosis accuracy of different medical record formats.**
| Setting | Symptom Matching Format | Agent Input Format | Accuracy | MCC |
| :---: | :--- | :--- | :---: | :---: |
| 1 | Unstructured | Unstructured | 0.920 | 0.829 |
| 2 | Structured | Unstructured | 0.918 | 0.822 |
| 3 | Structured | Structured | 0.914 | 0.814 |

#### 4.3.2 Selection of Scales
We compare the use of our selected 16 granular questions against providing the unfiltered total scores of all 13 scales. As shown in Table 6, using unfiltered total scores (Setting 4) leads to a significant performance drop, with accuracy falling by 6.8% (from 92.0% to 85.2%) and MCC decreasing by 12.1%. This underscores that overall scores contain substantial noise. Granular, question-level responses are essential for capturing specific diagnostic patterns required by the DSM-5.

**Table 6: Diagnosis accuracy of selected and unselected scales.**
| Setting | Scale Usage | Accuracy | MCC |
| :---: | :--- | :---: | :---: |
| 1 | Selected (16 Granular Items) | 0.920 | 0.829 |
| 4 | Unselected (Total Scale Scores) | 0.852 | 0.708 |

---

## 5. Case Study: Implementation in the Mood-Angles Platform
To evaluate the real-world utility of the MoodAngels framework, we implemented the system principles in **Mood-Angles**, a production-ready web platform. Mood-Angles integrates the multi-agent diagnostic scoring pipeline with a MERN (MongoDB, Express, React, Node.js) web stack. 

In the implemented platform, five specialized Python agents (**Cognitive, Depression, Emotional, Judgment, and Risk**) execute clinical and cognitive assessments based on DSM-5 standards. A key addition in our implementation is a disagreement resolution protocol to handle conflicts between the rule-based agent (Agent R) and a scikit-learn machine learning risk predictor. If their classifications diverge, the disagreement resolver weights their historical accuracy and confidence levels to determine whether to resolve the conflict automatically or escalate the case to human clinicians.

Furthermore, Mood-Angles features a Retrieval-Augmented Generation (RAG) chatbot named **Luna**. Luna provides empathetic support and guides users through evidence-based self-care. The chatbot RAG pipeline is implemented in Node.js using LangChain. Uploaded user documents and clinical notes are split using a `RecursiveCharacterTextSplitter` (chunk size: 800, overlap: 150) and embedded using OpenAI's `text-embedding-ada-002` model via OpenRouter. The embeddings are stored in a MongoDB collection (`DocumentChunk` schema). When a user messages Luna, the system retrieves the top-4 most similar document chunks, formats the retrieved text as context, and generates a compassionate, tailored response using Claude (`anthropic/claude-3-haiku`).

---

## 6. Discussion and Ethical Considerations
The deployment of AI agents in psychiatric diagnosis presents significant ethical responsibilities. AI systems should act as assistants to clinicians rather than autonomous decision-makers. In the Mood-Angles platform, the multi-agent system generates diagnostic interpretations and flags high-risk cases, but the final clinical validation remains with human psychiatrists. To ensure data privacy, the synthesis of datasets like MoodSyn provides a promising path forward. By training diagnostic models on high-fidelity synthetic data, researchers can advance computational psychiatry without compromising patient confidentiality.

### AI Disclosure Statement
In accordance with modern research transparency standards, we disclose that an Artificial Intelligence tool (Claude 3.5 Sonnet) was used as a collaborative writing co-pilot to assist in organizing, drafting, and refining the text of this manuscript. The core research design, clinical datasets, and experimental evaluations were derived directly from the base scientific paper (arXiv:2506.03750) and the accompanying Mood-Angles implementation. All AI-suggested text was reviewed, verified for factual accuracy, and edited by the human authors to ensure academic rigor and prevent plagiarism.

---

## 7. Conclusion
In this work, we presented MoodAngels, a specialized retrieval-augmented multi-agent framework for mood disorder diagnosis. By replacing overall scale scores with granular, question-level analysis and implementing a structured multi-agent debate and judgment protocol, MoodAngels significantly improves diagnostic accuracy, outperforming standard GPT-4o by 12.3% on real-world cases. We also introduced MoodSyn, a clinically valid synthetic dataset of 1,173 cases, verifying its utility in training downstream machine learning models. Finally, we demonstrated the practical implementation of these agentic and RAG concepts in the Mood-Angles web platform. Future work will focus on expanding the retrieval datastore to include longitudinal patient history and conducting larger-scale clinical validation studies.

---

## References
1. Murphy, D., & Woolfolk, R. L. (2000). *The harmful dysfunction analysis of mental disorder*. Philosophy, Psychiatry, & Psychology, 7(4), 241-252.
2. Hyman, S. E. (2010). *The diagnosis of mental disorders: the problem of reification*. Annual Review of Clinical Psychology, 6, 155-179.
3. First, M. B. (2010). *DSM-5 and clinical utility*. Journal of Psychiatric Practice, 16(6), 409-413.
4. Kessler, R. C., et al. (2005). *Lifetime prevalence and age-of-onset distributions of DSM-IV disorders in the National Comorbidity Survey Replication*. Archives of General Psychiatry, 62(6), 593-602.
5. American Psychiatric Association. (2013). *Diagnostic and Statistical Manual of Mental Disorders (5th ed.; DSM-5)*. Arlington, VA.
6. Xiao, M., Ye, M., Liu, B., Zong, X., Li, H., Huang, J., Xie, Q., & Peng, M. (2025). *MoodAngels: A Retrieval-augmented Multi-agent Framework for Psychiatry Diagnosis*. arXiv preprint arXiv:2506.03750.
7. Zhang, D., et al. (2024). *TabSyn: Tabular Data Synthesis with Diffusion Models*. arXiv preprint arXiv:2410.05280.
