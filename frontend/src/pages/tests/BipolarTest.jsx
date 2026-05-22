import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserWrapper from "../../components/UserWrapper";
import useDynamicQuestions from "../../hooks/useDynamicQuestions";

export default function BipolarTest() {
  const navigate = useNavigate();
  const API_BASE = (import.meta.env.DEV ? import.meta.env.VITE_LOCAL_BACKEND : import.meta.env.VITE_PROD_BACKEND) || "http://localhost:5000";
  const testName = "Bipolar Test";
  const userId = localStorage.getItem("userId");

  const defaultQuestions = [
    "I often experience bursts of energy or excitement that feel much stronger than my usual mood.",
    "There are times when I talk more rapidly or feel an unusual pressure to keep talking.",
    "I sometimes sleep far less than usual but still feel full of energy or alert.",
    "My thoughts can race so quickly that it becomes difficult to focus or stay organized.",
    "I occasionally feel unusually confident or capable, almost as if nothing could go wrong.",
    "I've made impulsive or risky decisions during periods of high energy (such as overspending or taking big chances).",
    "At times, I've felt easily irritated or short-tempered, even over small issues.",
    "I experience phases of extreme productivity or creativity that are hard to sustain.",
    "People close to me have commented on noticeable changes in my mood or behavior.",
    "I have felt unusually cheerful, talkative, or excitable for no clear reason.",
    "My mood can shift quickly — from feeling very good or energetic to feeling sad or hopeless.",
    "There are periods when I start big projects or plans but lose motivation shortly after.",
    "I've noticed physical restlessness, such as pacing or being unable to sit still.",
    "My eating habits or appetite change significantly depending on how I'm feeling.",
    "Sometimes I feel more outgoing or sexually confident than usual for me.",
    "I've had stretches of time where I felt deeply sad, hopeless, or uninterested in daily activities.",
    "When I feel down, I tend to withdraw from others or avoid social contact.",
    "My emotional ups and downs have affected my performance at school, work, or in relationships.",
    "A close family member has been diagnosed with bipolar disorder or another mood disorder.",
    "These changes in mood and energy have interfered with my daily life or responsibilities."
  ];

  const { questions, answers, handleSelect } = useDynamicQuestions("bipolar", defaultQuestions);
  const [previousResults, setPreviousResults] = useState([]);
  const [result, setResult] = useState(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPreviousResults = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`${API_BASE}/api/results/previous/bipolar?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setPreviousResults(data.previousResults || []);
        }
      } catch (err) {
        console.warn("Could not fetch previous results:", err.message);
      }
    };
    fetchPreviousResults();
  }, [userId]);

  const colors = ["#ef4444", "#f97316", "#facc15", "#3b82f6", "#22c55e"];

  // --- Helpers ---
  const safeText = (x) => {
    if (x === undefined || x === null) return "";
    if (typeof x === "string") return x;
    try {
      return JSON.stringify(x);
    } catch {
      return String(x);
    }
  };

  const buildAnswersPayload = () =>
    questions.reduce((acc, q, i) => {
      acc[`Q${i + 1}`] = `${q} → Answer: ${answers[i]}`;
      return acc;
    }, {});

  const computePercent = () => {
    // answers are 1..5
    const raw = answers.reduce((s, v) => s + (typeof v === "number" ? v : 0), 0);
    const maxRaw = questions.length * 5;
    if (maxRaw === 0) return 0;
    return Math.round((raw / maxRaw) * 100);
  };

  const computeNormalized10 = () => {
    const percent = computePercent();
    return Math.round(((percent / 100) * 10) * 10) / 10; // one decimal
  };

  const interpretLevel = (percent) =>
    percent <= 19
      ? "Low chance of Bipolar Disorder"
      : percent <= 50
      ? "Moderate chance of Bipolar Disorder"
      : percent <= 74
      ? "Some Concern (Watch for Symptoms)"
      : percent <= 86
      ? "Significant Behavioral Dysregulation"
      : "High likelihood of Bipolar Disorder";

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

  // --- Submit & Angel chain ---
  const handleSubmit = async () => {
    if (answers.some((a) => a === null)) {
      setResult({
        scorePercent: null,
        level: "Please answer all questions before submitting!",
      });
      return;
    }

    setLoading(true);

    const percentScore = computePercent();
    const norm10 = computeNormalized10();
    const level = interpretLevel(percentScore);

    // show immediate local result
    setResult({ scorePercent: percentScore, score10: norm10, level });

    let AngelR_summary = "";
    let dData = null;
    let cData = null;
    let eData = null;
    let cSummary = "";
    let eSummary = "";
    let jData = null;

    try {
      // ---------- Angel R ----------
      const rPayload = {
        testName,
        condition: "Bipolar Disorder",
        score_percent: percentScore,
        score_10: norm10,
        answers: buildAnswersPayload(),
      };

      const rRes = await fetch(`${API_BASE}/api/angelR`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rPayload),
      });

      if (!rRes.ok) {
        const txt = await rRes.text();
        throw new Error(`Angel R failed: ${rRes.status} ${rRes.statusText} — ${txt}`);
      }
      const rJson = await rRes.json();
      AngelR_summary = String(rJson.result || rJson.Result || safeText(rJson)).trim();
      setResult((prev) => ({ ...prev, AngelRDiagnosis: AngelR_summary }));

      // ---------- Angel D ----------
      const dRes = await fetch(`${API_BASE}/api/angelD`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testName,
          AngelR_result: AngelR_summary,
          score_percent: percentScore,
          score_10: norm10,
        }),
      });

      if (!dRes.ok) {
        const txt = await dRes.text();
        throw new Error(`Angel D failed: ${dRes.status} ${dRes.statusText} — ${txt}`);
      }
      dData = await dRes.json();
      setResult((prev) => ({ ...prev, AngelDExplanation: dData.result || dData.Result || safeText(dData) }));

      // ---------- Angel C ----------
      const cRes = await fetch(`${API_BASE}/api/angelC`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testName,
          AngelR_result: AngelR_summary,
          AngelD_result: dData.result || dData.Result || safeText(dData),
          score_percent: percentScore,
          score_10: norm10,
          answers: buildAnswersPayload(),
        }),
      });

      if (!cRes.ok) {
        const txt = await cRes.text();
        throw new Error(`Angel C failed: ${cRes.status} ${cRes.statusText} — ${txt}`);
      }
      cData = await cRes.json();
      cSummary = cData.result || cData.Result || safeText(cData);
      setResult((prev) => ({ ...prev, AngelCComparison: cSummary }));

      // ---------- Angel E ----------
      const eRes = await fetch(`${API_BASE}/api/angelE`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testName,
          AngelR_result: AngelR_summary,
          AngelD_result: dData.result || dData.Result || safeText(dData),
          AngelC_result: cSummary,
        }),
      });

      if (!eRes.ok) {
        const txt = await eRes.text();
        throw new Error(`Angel E failed: ${eRes.status} ${eRes.statusText} — ${txt}`);
      }
      eData = await eRes.json();
      eSummary = eData.final_consensus || eData.result || `${eData.supportive_argument || ""} ${eData.counter_argument || ""}`.trim();
      setResult((prev) => ({ ...prev, AngelEDebate: eSummary }));

      // ---------- Angel J (Judge) ----------
      const jRes = await fetch(`${API_BASE}/api/angelJ`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
body: JSON.stringify({
           testName,
           AngelR_result: AngelR_summary,
           AngelD_result: dData.result || dData.Result || safeText(dData),
           AngelC_result: cSummary,
           AngelE_result: eSummary,
           score_percent: percentScore,
           score_10: norm10,
           previousResults: previousResults,
         }),
      });

      if (!jRes.ok) {
        const txt = await jRes.text();
        setResult((prev) => ({ ...prev, AngelJDecision: `⚠️ Angel J failed: ${jRes.status} ${jRes.statusText} — ${txt}` }));
      } else {
        jData = await jRes.json();
        setResult((prev) => ({ ...prev, AngelJDecision: jData }));
      }

// ---------- Save to DB ----------
      const payloadToSave = {
        user: userId,
        testType: testName,
        score: percentScore, // REQUIRED by backend
        level,
        answers: buildAnswersPayload(),
        agentR_result: AngelR_summary || null,
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
              <span style={styles.metaBtnOrange}>✔ {questions.length} QUESTIONS</span>
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
                        onClick={() => handleSelect(i, j + 1)} // store 1..5
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelect(i, j + 1);
                          }
                        }}
                        aria-pressed={answers[i] === j + 1}
                        style={{
                          ...styles.circle,
                          borderColor: color,
                          backgroundColor: answers[i] === j + 1 ? color : "transparent",
                        }}
                        aria-label={`answer-${i + 1}-${j + 1}`}
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
                  <>
                    <div style={styles.heroScore}>
                      <div style={styles.heroTitle}>Your Bipolar Test Score</div>
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
                 
                 {/* Action Buttons */}
                 <div style={{ marginTop: "25px", display: "flex", gap: "15px", justifyContent: "center" }}>
                   <button
                     onClick={() => navigate(-1)}
                     style={{
                       background: "#6b7280",
                       color: "#fff",
                       border: "none",
                       borderRadius: "10px",
                       padding: "12px 24px",
                       fontSize: "15px",
                       fontWeight: "600",
                       cursor: "pointer",
                       boxShadow: "0 4px 12px rgba(107, 114, 128, 0.3)",
                       transition: "transform 0.2s ease"
                     }}
                     onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                     onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                   >
                     ← Go Back
                   </button>
                   <button
                      onClick={() => navigate("/chatbot", {
                       state: { 
                         testResult: {
                           score: result.scorePercent,
                           level: result.level,
                           testType: testName,
                           previousResults: previousResults
                         }
                       } 
                     })}
                     style={{
                       background: "linear-gradient(135deg, #7b61ff, #9371ff)",
                       color: "#fff",
                       border: "none",
                       borderRadius: "10px",
                       padding: "12px 24px",
                       fontSize: "15px",
                       fontWeight: "600",
                       cursor: "pointer",
                       boxShadow: "0 4px 12px rgba(123, 97, 255, 0.3)",
                       transition: "transform 0.2s ease"
                     }}
                     onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                     onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                   >
                     💬 Talk to Luna
                   </button>
                 </div>
               </div>
             )}
           </>
         )}
      </div>
    </UserWrapper>
  );
}

/* ------------------- STYLES (unchanged) ------------------- */
const styles = {container: {
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
   AngelRText: {
     marginTop: "12px",
     fontSize: "16px",
     color: "#444",
     lineHeight: "1.6",
   },
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
