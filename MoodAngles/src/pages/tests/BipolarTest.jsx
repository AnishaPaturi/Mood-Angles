import React, { useState } from "react";
import UserWrapper from "../../components/UserWrapper";

export default function BipolarTest() {
  const API_BASE = "http://localhost:5000";

  const questions = [
    "I have experienced periods of unusually high energy or feeling “amped up,” unlike my normal self.",
    "I sometimes talk faster than usual or feel pressure to keep talking.",
    "I can get by with much less sleep than normal and still feel full of energy.",
    "I often feel my thoughts are racing or jumping quickly from one idea to another.",
    "I’ve had times when I felt extremely confident or invincible, more than what’s typical for me.",
    "I’ve started risky or impulsive activities (e.g., spending, driving, or relationships) that later caused problems.",
    "There are days when I feel so irritable or short-tempered that small things make me snap at people.",
    "I’ve had periods of intense productivity or creativity that felt hard to control.",
    "Friends or family have noticed sudden changes in my mood or behavior.",
    "I’ve felt so happy or energetic that others thought I was acting unusual or out of character.",
    "I’ve experienced sudden mood swings — from feeling extremely up to feeling very down — within days or even hours.",
    "There are times when I make big plans or goals but lose interest or crash soon after.",
    "I’ve felt physically restless, unable to sit still, or unusually fidgety.",
    "I’ve noticed that my appetite changes dramatically depending on my mood.",
    "I sometimes feel unusually sexual or flirtatious compared to my normal behavior.",
    "I’ve had long periods (days or weeks) of feeling very low, hopeless, or disinterested in everything.",
    "I sometimes isolate myself or avoid people when I feel down.",
    "My mood changes have affected my school, work, or relationships.",
    "I have close relatives (parents, siblings, grandparents) diagnosed with bipolar disorder or manic-depressive illness.",
    "These mood changes interfere with my normal daily functioning."
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [result, setResult] = useState(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const colors = ["#ef4444", "#f97316", "#facc15", "#3b82f6", "#22c55e"];

  // ---- FIX: selection handler (safe + updates state) ----
  const handleSelect = (qIndex, value) => {
    if (qIndex < 0 || qIndex >= questions.length) return;
    const updated = [...answers];
    updated[qIndex] = value;
    setAnswers(updated);
  };

  // ---- Submit & Call Agents ----
  const handleSubmit = async () => {
  if (answers.some((a) => a === null)) {
    setResult({
      score: null,
      level: "Please answer all questions before submitting!",
    });
    return;
  }

  // ---------- Local Score ----------
  const rawScore = answers.reduce((a, v) => a + v, 0);
  const score = Math.round((rawScore / 80) * 100);
  const level =
    score <= 19
      ? "Low chance of Bipolar Disorder"
      : score <= 50
      ? "Moderate chance of Bipolar Disorder"
      : score <= 74
      ? "Some Concern (Watch for Symptoms)"
      : score <= 86
      ? "Significant Behavioral Dysregulation"
      : "High likelihood of Bipolar Disorder";

  setResult({ score, level });
  setLoading(true);

  try {
    // ---------- Agent R ----------
    const payload = {
      score,
      level,
      answers: questions.reduce((acc, q, i) => {
        acc[`Q${i + 1}`] = `${q} → Answer: ${answers[i]}`;
        return acc;
      }, {}),
    };

    const res = await fetch(`${API_BASE}/api/angelR`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Agent R failed: ${res.status}`);

    const data = await res.json();
    const finalSummary = String(data.result).trim();
    setResult((prev) => ({ ...prev, aiDiagnosis: finalSummary }));

    // ---------- Agent D ----------
    const dRes = await fetch(`${API_BASE}/api/angelD`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentR_result: finalSummary,
        score,
        level,
      }),
    });

    if (!dRes.ok) throw new Error(`Agent D failed: ${dRes.status}`);
    const dData = await dRes.json();
    setResult((prev) => ({ ...prev, agentDExplanation: dData.result }));

    // ---------- Agent C ----------
    const cRes = await fetch(`${API_BASE}/api/angelC`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentR_result: finalSummary,
        agentD_result: dData.result,
        score,
        level,
        answers: questions.reduce((acc, q, i) => {
          acc[`Q${i + 1}`] = `${q} → Answer: ${answers[i]}`;
          return acc;
        }, {}),
      }),
    });

    if (!cRes.ok) throw new Error(`Agent C failed: ${cRes.status}`);
    const cData = await cRes.json();
    setResult((prev) => ({ ...prev, agentCComparison: cData.result }));

    // ---------- Agent E ( Debate & Consensus ) ----------
    const eRes = await fetch(`${API_BASE}/api/angelE`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentR_result: finalSummary,
        agentD_result: dData.result,
        agentC_result: cData.result,
        condition: "Bipolar Disorder",
      }),
    });

    if (!eRes.ok) throw new Error(`Agent E failed: ${eRes.status}`);
    const eData = await eRes.json();

    setResult((prev) => ({
      ...prev,
      agentEDebate:
        eData.final_consensus ||
        eData.result ||
        `${eData.supportive_argument || ""} ${eData.counter_argument || ""}`,
    }));
  } catch (err) {
    console.error("Agent chain error:", err);
    setResult((prev) => ({
      ...prev,
      aiDiagnosis: "⚠️ Could not complete diagnosis chain.",
    }));
  } finally {
    setLoading(false);
  }
};


  return (
    <UserWrapper>
      <div style={styles.container}>
        {/* HEADER SECTION */}
        <div style={styles.headerContainer}>
          <img
            src="https://clearbehavioralhealth.com/wp-content/uploads/2024/08/what-is-bipolar-disorder.jpg"
            alt="Bipolar Test Header"
            style={styles.headerBg}
          />
          <div style={styles.headerOverlay}></div>

          <div style={styles.headerContent}>
            <h1 style={styles.mainTitle}>Bipolar Check</h1>
            <div style={styles.testMeta}>
              <span style={styles.metaBtnOrange}>✔ 20 QUESTIONS</span>
              <span style={styles.metaBtnPink}>⏱ 3 MINUTES</span>
            </div>
          </div>
        </div>

        {/* SUBSECTION */}
        <div style={styles.subSection}>
          <h2 style={styles.subTitle}>Could you be experiencing Bipolar disorder?</h2>
          <p style={styles.subDesc}>
            Bipolar disorder, sometimes called manic depression, is characterized by bouts of
            manic, high-energy episodes coupled with damaging bouts of depression. This test could
            help indicate whether symptoms are present.
          </p>
          {!started && (
            <button style={styles.startButton} onClick={() => setStarted(true)} type="button">
              🚀 Start Test
            </button>
          )}
        </div>

        {/* IF TEST STARTED */}
        {started && (
          <>
            <div style={styles.scaleBar}>
              <span style={styles.scaleText}>STRONGLY DISAGREE</span>
              <span style={styles.scaleText}>NEUTRAL</span>
              <span style={styles.scaleText}>STRONGLY AGREE</span>
            </div>

            <div style={styles.questionList}>
              {questions.map((q, i) => (
                <div key={i} style={styles.questionBlock}>
                  <h3 style={styles.questionText}>
                    {i + 1}. {q}
                  </h3>
                  <div style={styles.circleRow}>
                    {colors.map((color, j) => (
                      <button
                        key={j}
                        type="button"
                        onClick={() => handleSelect(i, j)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelect(i, j);
                          }
                        }}
                        aria-pressed={answers[i] === j}
                        style={{
                          ...styles.circle,
                          borderColor: color,
                          backgroundColor: answers[i] === j ? color : "transparent",
                        }}
                        aria-label={`answer-${i + 1}-${j}`}
                      />
                    ))}
                  </div>
                  <div style={styles.labelRow}>
                    <span style={styles.labelLeft}>DISAGREE</span>
                    <span style={styles.labelRight}>AGREE</span>
                  </div>
                  {i < questions.length - 1 && <div style={styles.divider} />}
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} style={styles.submitButton} disabled={loading} type="button">
              {loading ? "Analyzing..." : "Submit Test"}
            </button>

            {result && (
              <div style={styles.resultBox}>
                {result.score !== null && (
                  <p style={styles.resultScore}>Your Bipolar Check Score: {result.score}/100</p>
                )}
                <p style={styles.resultText}>{result.level}</p>
                {result.aiDiagnosis && (
                  <p style={styles.agentRText}>
                    <strong>Agent R Diagnosis:</strong> {result.aiDiagnosis}
                  </p>
                )}
                {result.agentDExplanation && (
                  <p style={{ marginTop: "10px", fontSize: "16px", color: "#444", lineHeight: "1.6" }}>
                    <strong>Agent D Summary:</strong> {result.agentDExplanation}
                  </p>
                )}
                {result.agentCComparison && (
                  <p style={{ marginTop: "10px", fontSize: "16px", color: "#444", lineHeight: "1.6" }}>
                    <strong>Agent C Comparative Summary:</strong> {result.agentCComparison}
                  </p>
                )}
                {result.agentEDebate && (
                  <p style={{ marginTop: "10px", fontSize: "16px", color: "#444", lineHeight: "1.6" }}>
                    <strong>Agent E Debate Summary:</strong> {result.agentEDebate}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </UserWrapper>
  );
}

/* ------------------- STYLES ------------------- */
const styles = {
  container: {
    background: "rgba(255,255,255,0.95)",
    width: "100vw",
    maxWidth: "100%",
    margin: "0",
    padding: "0 0 60px",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
  },
  headerContainer: {
    position: "relative",
    textAlign: "center",
    color: "#fff",
    overflow: "hidden",
  },
  headerBg: {
    width: "100%",
    height: "450px",
    objectFit: "cover",
  },
  headerOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
  },
  headerContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  mainTitle: {
    fontSize: "68px",
    fontWeight: "900",
    marginBottom: "25px",
    letterSpacing: "1px",
    textShadow: "2px 4px 10px rgba(0,0,0,0.6)",
  },
  testMeta: {
    display: "flex",
    justifyContent: "center",
    gap: "18px",
  },
  metaBtnOrange: {
    background: "rgba(249,115,22,0.9)",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "25px",
    fontWeight: "600",
    fontSize: "14px",
  },
  metaBtnPink: {
    background: "rgba(236,72,153,0.9)",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "25px",
    fontWeight: "600",
    fontSize: "14px",
  },
  subSection: {
    background: "linear-gradient(180deg, #f97316, #f59e0b)",
    color: "#fff",
    padding: "40px 20px 60px",
    clipPath: "ellipse(120% 65% at 50% 25%)",
  },
  subTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "12px",
  },
  subDesc: {
    fontSize: "16px",
    lineHeight: "1.7",
    maxWidth: "700px",
    margin: "0 auto 20px",
  },
  startButton: {
    background: "#7b61ff",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    padding: "14px 40px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 6px 14px rgba(123,97,255,0.3)",
  },
  scaleBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(90deg, #ef4444, #f59e0b, #3b82f6, #22c55e)",
    color: "#fff",
    borderRadius: "10px",
    padding: "12px 0",
    margin: "50px auto",
    width: "90%",
    fontWeight: "600",
    fontSize: "14px",
    gap: "60px",
  },
  scaleText: { textShadow: "0 1px 2px rgba(0,0,0,0.2)" },
  questionList: { marginTop: "20px", width: "90%", margin: "0 auto" },
  questionBlock: { marginBottom: "45px" },
  questionText: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "25px",
    fontWeight: "600",
  },
  circleRow: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "10px",
  },
  circle: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "3px solid #ccc",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "320px",
    margin: "8px auto",
  },
  labelLeft: { color: "#555", fontSize: "14px", fontWeight: "600" },
  labelRight: { color: "#555", fontSize: "14px", fontWeight: "600" },
  divider: {
    borderBottom: "1px solid #e5e7eb",
    width: "90%",
    margin: "35px auto",
  },
  submitButton: {
    display: "block",
    margin: "40px auto 0",
    backgroundColor: "#7b61ff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "14px 40px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(123,97,255,0.3)",
  },
  resultBox: {
    marginTop: "40px",
    backgroundColor: "#f3f4f6",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "80%",
    margin: "40px auto 0",
  },
  resultScore: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "8px",
  },
  resultText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#7b61ff",
  },
  agentRText: {
    marginTop: "12px",
    fontSize: "16px",
    color: "#444",
    lineHeight: "1.6",
  },
};
