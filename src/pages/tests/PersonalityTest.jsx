import { updateActivity } from "../../utils/activityTracker"; // path relative to file

// after successful test submission:
updateActivity("testTaken");



import React, { useState } from "react";
import UserWrapper from "../../components/UserWrapper";

export default function PsychopathyTest() {
  const questions = [
    "I’ve always found it easy to convince people to do favors for me.",
    "When I know someone is struggling, I think of them often and hope they’re doing OK.",
    "Other people make so many stupid mistakes compared to me.",
    "I don’t see a problem with lying if it helps me get what I want.",
    "If someone told me that I hurt their feelings, I would feel badly.",
    "In truth, I find most people boring or stupid.",
    "People often blame me for things that are actually their fault.",
    "People who refuse to break rules out of principle are foolish; they’ll never get ahead.",
    "Seeing someone cry has little effect on me, other than maybe irritating me.",
    "It's fun to antagonize people just to see how upset they get.",
    "I get uncomfortable at the thought of committing a crime.",
    "I usually know just what to say to make other people do what I want.",
    "I'll do whatever it takes to feel a thrill.",
    "It is important to honor financial obligations.",
    "Everyone else seems emotional and whiny compared to me.",
    "Helping other people instead of focusing on myself is usually a waste of time.",
    "I don’t understand people who are anxious or fearful all the time because nothing really scares me.",
    "Some people just aren’t meant to succeed in life, and that’s not my problem.",
    "I wear my heart on my sleeve.",
    "If a rule or law would get in the way of my goals, I feel justified in breaking it.",
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [result, setResult] = useState(null);
  const [started, setStarted] = useState(false);
  const colors = ["#ef4444", "#f97316", "#facc15", "#3b82f6", "#22c55e"];

  const handleSelect = (qIndex, value) => {
    const updated = [...answers];
    updated[qIndex] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    if (answers.some((a) => a === null)) {
      setResult({
        score: null,
        level: "Please answer all questions before submitting!",
      });
      return;
    }

    const rawScore = answers.reduce((a, v) => a + v, 0);
    const score = (rawScore / (questions.length * 4)) * 100; // Scale to 100

    let level = "";
    if (score <= 19) level = "Strong Prosocial Behavior (No Antisocial Tendencies)";
    else if (score <= 50) level = "Healthy Social Functioning (Few Antisocial Tendencies)";
    else if (score <= 74) level = "Moderate Concern (Some Antisocial Tendencies)";
    else if (score <= 86) level = "Significant Behavioral Dysregulation (Some Signs of Psychopathy)";
    else level = "Marked Psychopathic Profile (Several Signs of Psychopathy)";

    setResult({ score: Math.round(score), level });
  };

  return (
    <UserWrapper>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.headerContainer}>
          <img
            src="https://media.istockphoto.com/id/1178499463/photo/man-in-a-suit-removes-his-mask.jpg?s=612x612&w=0&k=20&c=c_apXm37HuW40TCkzrJRDciuHXqhhj90aDvK4V9KM-0="
            alt="Psychopathy Test Header"
            style={styles.headerBg}
          />
          <div style={styles.headerOverlay}></div>
          <div style={styles.headerContent}>
            <h1 style={styles.mainTitle}>Psychopathy Test</h1>
            <div style={styles.testMeta}>
              <span style={styles.metaBtnOrange}>✔ 20 QUESTIONS</span>
              <span style={styles.metaBtnPink}>⏱ 3 MINUTES</span>
            </div>
          </div>
        </div>

        {/* SUBSECTION */}
        <div style={styles.subSection}>
          <h2 style={styles.subTitle}>Do you show signs of psychopathy?</h2>
          <p style={styles.subDesc}>
            Cool under pressure, emotionally distant, and hard to read — psychopathy blends confidence with a lack of empathy. Those high in it often manipulate without guilt. Curious how your mind measures up? Take this test to uncover your spot on the psychopathy scale.
          </p>
          {!started && (
            <button style={styles.startButton} onClick={() => setStarted(true)}>
              🚀 Start Test
            </button>
          )}
        </div>

        {/* QUESTIONS */}
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
                        onClick={() => handleSelect(i, j)}
                        style={{
                          ...styles.circle,
                          borderColor: color,
                          backgroundColor: answers[i] === j ? color : "transparent",
                        }}
                      />
                    ))}
                  </div>
                  <div style={styles.labelRow}>
                    <span style={styles.labelLeft}>DISAGREE</span>
                    <span style={styles.labelRight}>AGREE</span>
                  </div>
                  {i < questions.length - 1 && <div style={styles.divider}></div>}
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} style={styles.submitButton}>
              Submit Test
            </button>

            {result && (
              <div style={styles.resultBox}>
                {result.score !== null && (
                  <p style={styles.resultScore}>Your Score: {result.score} / 100</p>
                )}
                <p style={styles.resultText}>{result.level}</p>
              </div>
            )}
          </>
        )}
      </div>
    </UserWrapper>
  );
}

/* ------------------- STYLES (unchanged) ------------------- */
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
  headerContainer: { position: "relative", textAlign: "center", color: "#fff", overflow: "hidden" },
  headerBg: { width: "100%", height: "450px", objectFit: "cover" },
  headerOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0.7))" },
  headerContent: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
  mainTitle: { fontSize: "68px", fontWeight: "900", marginBottom: "25px", letterSpacing: "1px", textShadow: "2px 4px 10px rgba(0,0,0,0.6)" },
  testMeta: { display: "flex", justifyContent: "center", gap: "18px" },
  metaBtnOrange: { background: "rgba(249,115,22,0.9)", color: "#fff", padding: "10px 18px", borderRadius: "25px", fontWeight: "600", fontSize: "14px", backdropFilter: "blur(6px)" },
  metaBtnPink: { background: "rgba(236,72,153,0.9)", color: "#fff", padding: "10px 18px", borderRadius: "25px", fontWeight: "600", fontSize: "14px", backdropFilter: "blur(6px)" },
  subSection: { background: "linear-gradient(180deg, #f97316, #f59e0b)", color: "#fff", padding: "40px 20px 60px", clipPath: "ellipse(120% 65% at 50% 25%)" },
  subTitle: { fontSize: "32px", fontWeight: "700", marginBottom: "12px" },
  subDesc: { fontSize: "16px", lineHeight: "1.7", maxWidth: "700px", margin: "0 auto 20px" },
  startButton: { background: "#7b61ff", color: "#fff", border: "none", borderRadius: "30px", padding: "14px 40px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "10px", boxShadow: "0 6px 14px rgba(123,97,255,0.3)", transition: "all 0.3s ease" },
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
  submitButton: { display: "block", margin: "40px auto 0", backgroundColor: "#7b61ff", color: "#fff", border: "none", borderRadius: "10px", padding: "14px 40px", fontSize: "16px", fontWeight: "600", cursor: "pointer", boxShadow: "0 6px 14px rgba(123,97,255,0.3)", transition: "transform 0.2s ease, box-shadow 0.2s ease" },
  resultBox: { marginTop: "40px", backgroundColor: "#f3f4f6", borderRadius: "12px", padding: "25px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "80%", marginLeft: "auto", marginRight: "auto" },
  resultScore: { fontSize: "20px", fontWeight: "700", color: "#333", marginBottom: "8px" },
  resultText: { fontSize: "18px", fontWeight: "600", color: "#7b61ff" },
};
