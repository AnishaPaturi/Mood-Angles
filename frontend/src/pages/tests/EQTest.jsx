import React, { useState } from "react";
import UserWrapper from "../../components/UserWrapper";

export default function EmotionalIntelligenceTest() {
  const API_BASE = (import.meta.env.DEV ? import.meta.env.VITE_LOCAL_BACKEND : import.meta.env.VITE_PROD_BACKEND) || "http://localhost:5000";
  const testName = "Emotional Intelligence";
  const userId = localStorage.getItem("userId");

  const questions = [
    "I can recognize and understand my emotions as they happen.",
    "I notice and interpret other people’s body language and tone of voice.",
    "I sometimes lose my temper more quickly than I’d like.",
    "I learn and grow from emotional experiences, even difficult ones.",
    "When making an important decision, I consider both my current feelings and how I might feel later.",
    "I recover well from emotional setbacks or disappointments.",
    "I’m comfortable expressing a wide range of emotions in healthy ways.",
    "I can stay calm and respectful during disagreements or conflict.",
    "I try to understand and accept other people’s emotions without judging them.",
    "I can stay grounded and steady in challenging or stressful situations.",
    "I’m able to stay composed and think clearly when things get tough.",
    "I sometimes speak or react impulsively before thinking about how it affects others.",
    "I often feel and express gratitude toward others.",
    "I accept my emotions, even when they’re uncomfortable or unpleasant.",
    "I adjust my behavior when situations or people require something different from me.",
    "I’m open to feedback and willing to try new approaches when things don’t work.",
    "I try to validate and acknowledge other people’s feelings.",
    "I can adapt easily to changing circumstances or environments.",
    "I sometimes find it hard to understand what others are feeling.",
    "I occasionally struggle to identify exactly what I’m feeling inside."
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [result, setResult] = useState(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const colors = ["#ef4444", "#f97316", "#facc15", "#3b82f6", "#22c55e"];

  const handleSelect = (qIndex, value) => {
    if (qIndex < 0 || qIndex >= questions.length) return;
    const updated = [...answers];
    updated[qIndex] = value;
    setAnswers(updated);
  };

  const buildAnswersPayload = () =>
    questions.reduce((acc, q, i) => {
      acc[`Q${i + 1}`] = `${q} → Answer: ${answers[i]}`;
      return acc;
    }, {});

  const computeScore = () => {
    // answers are 0..4; convert raw sum to 0..100 %
    const raw = answers.reduce((s, v) => s + (typeof v === "number" ? v : 0), 0);
    const max = questions.length * (colors.length - 1); // 4 * n
    if (max === 0) return 0;
    return Math.round((raw / max) * 100);
  };

   const interpretLevel = (score) => {
     if (score <= 16) return "Very low emotional intelligence";
     if (score <= 36) return "Low emotional intelligence";
     if (score <= 63) return "Average (neither low nor high) emotional intelligence";
     if (score <= 83) return "High emotional intelligence";
     return "Very high emotional intelligence";
   };

  // --- Save results to DB helper ---
  const sendResultToDB = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/api/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Save failed: ${res.status} ${res.statusText} — ${txt}`);
      }
      return await res.json();
    } catch (err) {
      console.error("Error saving result to DB:", err);
      return { error: String(err) };
    }
  };

   const safeText = (x) => {
     if (!x && x !== 0) return "";
     if (typeof x === "string") return x;
     try {
       return JSON.stringify(x);
     } catch {
       return String(x);
     }
   };

   const handleSubmit = async () => {
    if (answers.some((a) => a === null)) {
      setResult({
        score: null,
        level: "⚠️ Please answer all questions before submitting!"
      });
      return;
    }

    setLoading(true);
    const score = computeScore();
    const level = interpretLevel(score);
    setResult({ score, level });

     // intermediary storage
     let finalSummary = "";
     let dData = null;
     let cData = null;
     let eData = null;
     let cSummary = "";
     let eSummary = "";
     let jData = null;

     try {
      // ---------- Angel R ----------
      const payloadR = {
        condition: testName,
        testName,
        score,
        level,
        answers: buildAnswersPayload()
      };

      const rRes = await fetch(`${API_BASE}/api/angelR`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadR)
      });

      if (!rRes.ok) {
        const txt = await rRes.text();
        throw new Error(`Angel R failed: ${rRes.status} ${rRes.statusText} — ${txt}`);
      }
      const rData = await rRes.json();
      finalSummary = String(rData.result || rData.Result || safeText(rData)).trim();
      setResult((prev) => ({ ...prev, aiDiagnosis: finalSummary }));

      // ---------- Angel D ----------
      const dRes = await fetch(`${API_BASE}/api/angelD`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: testName,
          testName,
          agentR_result: finalSummary,
          score,
          level
        })
      });

      if (!dRes.ok) {
        const txt = await dRes.text();
        throw new Error(`Angel D failed: ${dRes.status} ${dRes.statusText} — ${txt}`);
      }
      dData = await dRes.json();
      setResult((prev) => ({ ...prev, agentDExplanation: dData.result || dData.Result || safeText(dData) }));

      // ---------- Angel C ----------
      const cRes = await fetch(`${API_BASE}/api/angelC`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: testName,
          testName,
          agentR_result: finalSummary,
          agentD_result: dData.result || dData.Result || safeText(dData),
          score,
          level,
          answers: buildAnswersPayload()
        })
      });

      if (!cRes.ok) {
        const txt = await cRes.text();
        throw new Error(`Angel C failed: ${cRes.status} ${cRes.statusText} — ${txt}`);
      }
      cData = await cRes.json();
      cSummary = cData.result || cData.Result || safeText(cData);
      setResult((prev) => ({ ...prev, agentCComparison: cSummary }));

      // ---------- Angel E (Debate/Consensus) ----------
      const eRes = await fetch(`${API_BASE}/api/angelE`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: testName,
          testName,
          agentR_result: finalSummary,
          agentD_result: dData.result || dData.Result || safeText(dData),
          agentC_result: cSummary
        })
      });

      if (!eRes.ok) {
        const txt = await eRes.text();
        throw new Error(`Angel E failed: ${eRes.status} ${eRes.statusText} — ${txt}`);
      }
      eData = await eRes.json();
      eSummary = eData.final_consensus || eData.result || `${eData.supportive_argument || ""} ${eData.counter_argument || ""}`.trim();
      setResult((prev) => ({ ...prev, agentEDebate: eSummary }));

       // ---------- Angel J (Judge) ----------
      try {
        const jRes = await fetch(`${API_BASE}/api/angelJ`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            condition: testName,
            testName,
            agentR_result: finalSummary,
            agentD_result: dData.result || dData.Result || safeText(dData),
            agentC_result: cSummary,
            agentE_result: eSummary,
            score,
            level
          })
        });

        if (!jRes.ok) {
          const txt = await jRes.text();
          setResult((prev) => ({ ...prev, AngelJDecision: `⚠️ Angel J failed: ${jRes.status} ${jRes.statusText} — ${txt}` }));
         } else {
           jData = await jRes.json();
           setResult((prev) => ({ ...prev, AngelJDecision: jData }));
         }
       } catch (err) {
         console.error("Angel J connection error:", err);
         setResult((prev) => ({ ...prev, AngelJDecision: "⚠️ Could not connect to Angel J backend." }));
       }

// ---------- Save to DB ----------
       const payloadToSave = {
         user: userId,
         testType: testName,
         score: score, // REQUIRED by backend
         level,
         answers: buildAnswersPayload(),
         agentR_result: finalSummary || null,
         agentD_result: dData?.result || null,
         agentC_result: cSummary || null,
         agentE_result: eSummary || null,
         agentJ_result: jData || null,
         meta: { submittedAt: new Date().toISOString() }
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
      console.error("Angel chain error:", err);
      setResult((prev) => ({
        ...prev,
        chainError: err.message,
        aiDiagnosis: prev?.aiDiagnosis || "⚠️ Could not complete diagnosis chain."
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserWrapper>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.headerContainer}>
          <img
            src="https://t4.ftcdn.net/jpg/06/04/38/29/240_F_604382909_wIVX5mencOVhuW0mR5l4tUduOooaUCib.jpg"
            alt="Emotional Intelligence Header"
            style={styles.headerBg}
          />
          <div style={styles.headerOverlay} />
          <div style={styles.headerContent}>
            <h1 style={styles.mainTitle}>Emotional Intelligence (EQ) Test</h1>
            <div style={styles.testMeta}>
              <span style={styles.metaBtnOrange}>✔ {questions.length} QUESTIONS</span>
              <span style={styles.metaBtnPink}>⏱ 3 MINUTES</span>
            </div>
          </div>
        </div>

        {/* SUBSECTION */}
        <div style={styles.subSection}>
          <h2 style={styles.subTitle}>How emotionally aware and resilient are you?</h2>
          <p style={styles.subDesc}>
            EQ measures how you perceive, manage, and respond to emotions. This quick quiz gives a rough
            indication and — if concerning — suggests further reflection or professional guidance.
          </p>
          {!started && (
            <button style={styles.startButton} onClick={() => setStarted(true)}>
              🚀 Start Test
            </button>
          )}
        </div>

        {/* TEST */}
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
                        aria-pressed={answers[i] === j}
                        style={{
                          ...styles.circle,
                          borderColor: color,
                          backgroundColor: answers[i] === j ? color : "transparent"
                        }}
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

            <button onClick={handleSubmit} style={styles.submitButton} disabled={loading}>
              {loading ? "Analyzing..." : "Submit Test"}
            </button>

            {/* RESULTS */}
            {result && (
              <div style={styles.resultBox}>
                {result.score !== null && (
                  <>
                    <div style={styles.heroScore}>
                      <div style={styles.heroTitle}>Your Emotional Intelligence (EQ) Score</div>
                      <div style={styles.gaugeContainer}>
                        <svg width="200" height="120" viewBox="0 0 200 120">
                          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
                          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#7b61ff" strokeWidth="12" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={251.2 - (result.score / 100) * 251.2} />
                          <circle cx={20 + (result.score / 100) * 160} cy={100 - Math.sin((result.score / 100) * Math.PI) * 80} r="10" fill="#7b61ff" />
                        </svg>
                        <div style={styles.gaugeScore}>{result.score}<span style={styles.gaugeTotal}>/100</span></div>
                      </div>
                      <div style={styles.gaugeLabels}>
                        <span style={{color: "#22c55e"}}>Few</span>
                        <span style={{color: "#facc15"}}>Some</span>
                        <span style={{color: "#ef4444"}}>Many</span>
                      </div>
                      <div style={styles.heroBadge}>{interpretLevel(result.score)}</div>
                    </div>
                    <p style={styles.disclaimer}>
                      This is a screening tool, not a clinical diagnosis.
                    </p>
                  </>
                )}
                {result.AngelJDecision && (
                  <>
                    <div style={styles.meaningSection}>
                      <h4 style={styles.sectionTitle}>What This Means</h4>
                      {typeof result.AngelJDecision === "string" ? (
                        <p style={styles.meaningText}>{result.AngelJDecision}</p>
                      ) : (
                        <p style={styles.meaningText}>
                          {result.AngelJDecision.decision === "Likely"
                            ? `Your responses indicate strong signs of ${testName}. Consider consulting a healthcare professional.`
                            : result.AngelJDecision.decision === "Possible"
                            ? `Some indicators suggest ${testName} may be a concern. Further evaluation could be beneficial.`
                            : `Few indicators of ${testName} were present.`}
                        </p>
                      )}
                    </div>

                    <div style={styles.nextStepsSection}>
                      <h4 style={styles.sectionTitle}>Suggested Next Steps</h4>
                      {typeof result.AngelJDecision === "object" && result.AngelJDecision.actions && (
                        <div style={styles.stepsList}>
                          {Array.isArray(result.AngelJDecision.actions)
                            ? result.AngelJDecision.actions.map((a, idx) => (
                                <div key={idx} style={styles.stepItem}>
                                  <span style={styles.stepIcon}>✓</span>
                                  <span style={styles.stepText}>{a}</span>
                                </div>
                              ))
                            : <div style={styles.stepItem}><span style={styles.stepIcon}>✓</span><span style={styles.stepText}>{result.AngelJDecision.actions}</span></div>
                          }
                        </div>
                      )}
                    </div>

                    <div style={styles.timingBox}>
                      <strong>When to connect with care:</strong>{" "}
                      {result.AngelJDecision.urgency === "urgent" ? "Soon — within days" :
                       result.AngelJDecision.urgency === "high" ? "Within 1-2 weeks" :
                       result.AngelJDecision.urgency === "medium-high" ? "Within 2-4 weeks" :
                       result.AngelJDecision.urgency === "medium" ? "Within 1-2 months" : "Routine — a few months is okay"}
                    </div>

                    <div style={styles.toolsBox}>
                      <strong>Tools you can use:</strong> Consider taking a validated assessment for {testName} or consult a mental health professional.
                    </div>
                  </>
                )}
                {result.chainError && (
                  <p style={{ marginTop: "10px", color: "#b91c1c" }}>
                    <strong>Chain error:</strong> {result.chainError}
                  </p>
                )}
                {result.savedOk === true && (
                  <p style={{ marginTop: "8px", color: "#064e3b" }}>
                    Results saved (id: {result.savedId || "n/a"})
                  </p>
                )}
                {result.savedOk === false && result.savedError && (
                  <p style={{ marginTop: "8px", color: "#b91c1c" }}>
                    Save error: {result.savedError}
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
const styles = {container: {
    background: "rgba(255,255,255,0.95)",
    width: "100vw",
    maxWidth: "100%",
    margin: "0",
    padding: "0 0 60px",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center"
  },
  headerContainer: {
    position: "relative",
    textAlign: "center",
    color: "#fff",
    overflow: "hidden"
  },
  headerBg: {
    width: "100%",
    height: "450px",
    objectFit: "cover"
  },
  headerOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3))"
  },
  headerContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  mainTitle: { fontSize: "68px", fontWeight: "900", marginBottom: "25px", textShadow: "2px 4px 10px rgba(0,0,0,0.6)" },
  testMeta: { display: "flex", justifyContent: "center", gap: "18px" },
  metaBtnOrange: { background: "rgba(249,115,22,0.9)", color: "#fff", padding: "10px 18px", borderRadius: "25px", fontWeight: "600" },
  metaBtnPink: { background: "rgba(236,72,153,0.9)", color: "#fff", padding: "10px 18px", borderRadius: "25px", fontWeight: "600" },
  subSection: { background: "linear-gradient(180deg, #243cc9, #4169e1)", color: "#fff", padding: "40px 20px 60px", clipPath: "ellipse(120% 65% at 50% 25%)" },
  subTitle: { fontSize: "32px", fontWeight: "700", marginBottom: "12px" },
  subDesc: { fontSize: "16px", lineHeight: "1.7", maxWidth: "700px", margin: "0 auto 20px" },
  startButton: { background: "#7b61ff", color: "#fff", border: "none", borderRadius: "30px", padding: "14px 40px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "10px", boxShadow: "0 6px 14px rgba(123,97,255,0.3)" },
  scaleBar: { display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(90deg, #ef4444, #f59e0b, #3b82f6, #22c55e)", color: "#fff", borderRadius: "10px", padding: "12px 0", margin: "50px auto", width: "90%", fontWeight: "600", fontSize: "14px", gap: "60px" },
  scaleText: { textShadow: "0 1px 2px rgba(0,0,0,0.2)" },
  questionList: { marginTop: "20px", width: "90%", marginLeft: "auto", marginRight: "auto" },
  questionBlock: { marginBottom: "45px" },
  questionText: { fontSize: "18px", color: "#333", marginBottom: "25px", fontWeight: "600" },
  circleRow: { display: "flex", justifyContent: "center", gap: "30px", marginBottom: "10px" },
  circle: { width: "60px", height: "60px", borderRadius: "50%", border: "3px solid #ccc", cursor: "pointer", transition: "all 0.3s ease" },
  labelRow: { display: "flex", justifyContent: "space-between", width: "320px", margin: "8px auto" },
  labelLeft: { color: "#555", fontSize: "14px", fontWeight: "600" },
  labelRight: { color: "#555", fontSize: "14px", fontWeight: "600" },
  divider: { borderBottom: "1px solid #e5e7eb", width: "90%", margin: "35px auto" },
  submitButton: { display: "block", margin: "40px auto 0", backgroundColor: "#7b61ff", color: "#fff", border: "none", borderRadius: "10px", padding: "14px 40px", fontSize: "16px", fontWeight: "600", cursor: "pointer", boxShadow: "0 6px 14px rgba(123,97,255,0.3)" },
  resultBox: { marginTop: "40px", backgroundColor: "#f3f4f6", borderRadius: "12px", padding: "25px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "80%", marginLeft: "auto", marginRight: "auto" },
  resultScore: { fontSize: "20px", fontWeight: "700", color: "#333", marginBottom: "8px" },
  resultText: { fontSize: "18px", fontWeight: "600", color: "#7b61ff" },
   agentRText: { marginTop: 12, fontSize: 16, color: "#444" },
   disclaimer: { marginTop: "20px", color: "#666", fontSize: "14px" },
   heroScore: {
    background: "linear-gradient(135deg, #7b61ff 0%, #9371ff 100%)", 
    borderRadius: "20px", 
    padding: "30px 20px", 
    color: "#fff",
    marginBottom: "20px"
  },
  heroTitle: { fontSize: "18px", fontWeight: "500", opacity: "0.9", marginBottom: "10px" },
  gaugeContainer: { position: "relative", height: "120px", display: "flex", alignItems: "center", justifyContent: "center" },
  gaugeScore: { position: "absolute", top: "40px", fontSize: "36px", fontWeight: "800", color: "#fff" },
  gaugeTotal: { fontSize: "20px", fontWeight: "400", opacity: "0.7" },
  gaugeLabels: { display: "flex", justifyContent: "space-between", padding: "0 20px", marginTop: "10px", fontSize: "14px", fontWeight: "600" },
  heroBadge: { display: "inline-block", background: "rgba(255,255,255,0.2)", color: "#fff", padding: "6px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "600", marginTop: "15px" },
  meaningSection: { background: "#fff", borderRadius: "12px", padding: "20px", marginTop: "20px" },
  nextStepsSection: { background: "#fff", borderRadius: "12px", padding: "20px", marginTop: "15px" },
  sectionTitle: { fontSize: "18px", fontWeight: "700", color: "#333", marginBottom: "12px" },
  meaningText: { fontSize: "15px", color: "#444", lineHeight: "1.6" },
  stepsList: { marginTop: "10px" },
  stepItem: { display: "flex", alignItems: "flex-start", marginBottom: "10px" },
  stepIcon: { color: "#22c55e", fontWeight: "bold", marginRight: "8px", fontSize: "16px" },
  stepText: { fontSize: "15px", color: "#444", flex: 1 },
  timingBox: { background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: "8px", padding: "10px 15px", fontSize: "14px", marginTop: "15px" },
  toolsBox: { background: "#ede9fe", border: "1px solid #7b61ff", borderRadius: "8px", padding: "10px 15px", fontSize: "14px", marginTop: "15px" }
};;
