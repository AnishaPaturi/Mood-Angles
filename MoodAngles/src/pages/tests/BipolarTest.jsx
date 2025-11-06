import React, { useState } from "react";
import UserWrapper from "../../components/UserWrapper";

export default function BipolarTest() {
  const API_BASE = "http://localhost:5000";

  const questions = [
    "I often experience bursts of energy or excitement that feel much stronger than my usual mood.",
    "There are times when I talk more rapidly or feel an unusual pressure to keep talking.",
    "I sometimes sleep far less than usual but still feel full of energy or alert.",
    "My thoughts can race so quickly that it becomes difficult to focus or stay organized.",
    "I occasionally feel unusually confident or capable, almost as if nothing could go wrong.",
    "I’ve made impulsive or risky decisions during periods of high energy (such as overspending or taking big chances).",
    "At times, I’ve felt easily irritated or short-tempered, even over small issues.",
    "I experience phases of extreme productivity or creativity that are hard to sustain.",
    "People close to me have commented on noticeable changes in my mood or behavior.",
    "I have felt unusually cheerful, talkative, or excitable for no clear reason.",
    "My mood can shift quickly — from feeling very good or energetic to feeling sad or hopeless.",
    "There are periods when I start big projects or plans but lose motivation shortly after.",
    "I’ve noticed physical restlessness, such as pacing or being unable to sit still.",
    "My eating habits or appetite change significantly depending on how I’m feeling.",
    "Sometimes I feel more outgoing or sexually confident than usual for me.",
    "I’ve had stretches of time where I felt deeply sad, hopeless, or uninterested in daily activities.",
    "When I feel down, I tend to withdraw from others or avoid social contact.",
    "My emotional ups and downs have affected my performance at school, work, or in relationships.",
    "A close family member has been diagnosed with bipolar disorder or another mood disorder.",
    "These changes in mood and energy have interfered with my daily life or responsibilities."
];


  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [result, setResult] = useState(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const colors = ["#ef4444", "#f97316", "#facc15", "#3b82f6", "#22c55e"];

  // selection handler
  const handleSelect = (qIndex, value) => {
    if (qIndex < 0 || qIndex >= questions.length) return;
    const updated = [...answers];
    updated[qIndex] = value;
    setAnswers(updated);
  };

  // helper to build answers object
  const buildAnswersPayload = () =>
    questions.reduce((acc, q, i) => {
      acc[`Q${i + 1}`] = `${q} → Answer: ${answers[i]}`;
      return acc;
    }, {});

   // add inside your component (replace existing handleSubmit)
const sendResultToDB = async (payload) => {
  try {
    const res = await fetch(`${API_BASE}/api/results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If you use auth add token here:
        // "Authorization": `Bearer ${yourAuthToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Save failed: ${res.status} ${res.statusText} — ${txt}`);
    }
    const json = await res.json();
    return json; // expected { ok: true, id: "..."} per route
  } catch (err) {
    console.error("Error saving result to DB:", err);
    return { error: String(err) };
  }
};

const handleSubmit = async () => {
  if (answers.some((a) => a === null)) {
    setResult({
      score: null,
      level: "Please answer all questions before submitting!",
    });
    return;
  }

  setLoading(true);

  const percentScore = computePercent();
  const norm10 = computeNormalized10();
  const level = interpretLevel(percentScore);

  // local immediate feedback
  setResult({ scorePercent: percentScore, score10: norm10, level });

  // agent outputs to fill in as they complete
  let agentR_summary = "";
  let dData = null;
  let cData = null;
  let eData = null;
  let cSummary = "";
  let eSummary = "";
  let jData = null;

  try {
    // Agent R
    const rPayload = {
      testName,
      condition: "psychopathy",
      score_percent: percentScore,
      score_10: norm10,
      answers: buildAnswersPayload(),
    };
    const rRes = await fetch(`${API_BASE}/api/angelR`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rPayload),
    });
    if (!rRes.ok) throw new Error(`Agent R failed: ${rRes.status}`);
    const rJson = await rRes.json();
    agentR_summary = String(rJson.result || rJson.Result || safeText(rJson)).trim();
    setResult((prev) => ({ ...prev, agentRDiagnosis: agentR_summary }));

    // Agent D
    const dRes = await fetch(`${API_BASE}/api/angelD`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testName,
        agentR_result: agentR_summary,
        score_percent: percentScore,
        score_10: norm10,
      }),
    });
    if (!dRes.ok) throw new Error(`Agent D failed: ${dRes.status}`);
    dData = await dRes.json();
    setResult((prev) => ({ ...prev, agentDExplanation: dData.result || safeText(dData) }));

    // Agent C
    const cRes = await fetch(`${API_BASE}/api/angelC`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testName,
        agentR_result: agentR_summary,
        agentD_result: dData.result || safeText(dData),
        score_percent: percentScore,
        score_10: norm10,
        answers: buildAnswersPayload(),
      }),
    });
    if (!cRes.ok) throw new Error(`Agent C failed: ${cRes.status}`);
    cData = await cRes.json();
    cSummary = cData.result || cData.Result || safeText(cData);
    setResult((prev) => ({ ...prev, agentCComparison: cSummary }));

    // Agent E
    const eRes = await fetch(`${API_BASE}/api/angelE`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testName,
        agentR_result: agentR_summary,
        agentD_result: dData.result || safeText(dData),
        agentC_result: cSummary,
      }),
    });
    if (!eRes.ok) throw new Error(`Agent E failed: ${eRes.status}`);
    eData = await eRes.json();
    eSummary = eData.final_consensus || eData.result || `${eData.supportive_argument || ""} ${eData.counter_argument || ""}`.trim();
    setResult((prev) => ({ ...prev, agentEDebate: eSummary }));

    // Agent J (Judge)
    const jRes = await fetch(`${API_BASE}/api/angelJ`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testName,
        agentR_result: agentR_summary,
        agentD_result: dData.result || safeText(dData),
        agentC_result: cSummary,
        agentE_result: eSummary,
        score_percent: percentScore,
        score_10: norm10,
      }),
    });

    if (!jRes.ok) {
      const txt = await jRes.text();
      setResult((prev) => ({ ...prev, agentJDecision: `⚠️ Agent J failed: ${jRes.status} — ${txt}` }));
    } else {
      jData = await jRes.json();
      setResult((prev) => ({ ...prev, agentJDecision: jData }));
    }

    // ---------------------------
    // SEND FINAL RESULT TO DATABASE
    // ---------------------------
    const payloadToSave = {
      testType: testName,
      score: percentScore,
      score_10: norm10,
      level,
      answers: buildAnswersPayload(),
      agentR_result: agentR_summary || null,
      agentD_result: dData?.result || null,
      agentC_result: cSummary || null,
      agentE_result: eSummary || null,
      agentJ_result: jData || null,
      meta: { submittedAt: new Date().toISOString() },
    };

    const saveResp = await sendResultToDB(payloadToSave);

    if (saveResp && saveResp.ok) {
      setResult((prev) => ({ ...prev, savedId: saveResp.id || saveResp._id || null, savedOk: true }));
    } else if (saveResp && saveResp.error) {
      setResult((prev) => ({ ...prev, savedOk: false, savedError: saveResp.error }));
    } else {
      setResult((prev) => ({ ...prev, savedOk: false }));
    }
  } catch (err) {
    console.error("Agent chain error:", err);
    setResult((prev) => ({
      ...prev,
      chainError: err.message,
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

                {/* {result.aiDiagnosis && (
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
                )} */}

                {/* Agent J output render */}
                {result.agentJDecision && (
                  <div style={{ marginTop: "12px", textAlign: "left", color: "#444" }}>
                    <strong>Agent J (Judge) Decision:</strong>
                    {typeof result.agentJDecision === "string" ? (
                      <div style={{ marginTop: "6px" }}>{result.agentJDecision}</div>
                    ) : (
                      <div style={{ marginTop: "8px" }}>
                        {result.agentJDecision.decision && (
                          <div><strong>Decision:</strong> {result.agentJDecision.decision}</div>
                        )}
                        {result.agentJDecision.confidence !== undefined && (
                          <div><strong>Confidence:</strong> {String(result.agentJDecision.confidence)}</div>
                        )}
                        {result.agentJDecision.reasoning && (
                          <div style={{ marginTop: "6px" }}>
                            <strong>Reasoning:</strong> {result.agentJDecision.reasoning}
                          </div>
                        )}
                        {Array.isArray(result.agentJDecision.actions) && result.agentJDecision.actions.length > 0 && (
                          <div style={{ marginTop: "6px" }}>
                            <strong>Actions:</strong>
                            <ul style={{ marginTop: "6px" }}>
                              {result.agentJDecision.actions.map((a, idx) => (
                                <li key={idx}>{a}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* show chain error when present for debugging */}
                {result.chainError && (
                  <p style={{ marginTop: "10px", color: "#b91c1c" }}>
                    <strong>Chain error:</strong> {result.chainError}
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
