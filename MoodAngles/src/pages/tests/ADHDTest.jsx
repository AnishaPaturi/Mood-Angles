import React, { useState } from "react";
import UserWrapper from "../../components/UserWrapper";

export default function ADHDTest() {
  const questions = [
    "I frequently make typos, miscalculations, or other careless errors at work.",
    "I talk more than others, or more than I think I should.",
    "I find it hard to follow along with lectures or long conversations, even ones I'm involved in.",
    "I often start tasks so late that I miss the deadline.",
    "I find it easy to sit still for long periods of time.",
    "When someone asks me to complete an important task, I usually do so without being reminded.",
    "I find myself avoiding tasks that require a lot of focus.",
    "I'm always losing my keys, my wallet, or other important items.",
    "Waiting in line is excruciating for me.",
    "When someone asks me a question, I often start answering before they've finished speaking.",
    "I often do whatever pops into my head first, even if it's not the best choice.",
    "I frequently abandon tasks halfway through because something else distracted me.",
    "If someone else is talking or making noise while I’m working, it's hard for me to stay focused.",
    "I get easily frustrated or upset.",
    "I get so absorbed in my hobbies that I feel disconnected from the rest of the world.",
    "I usually pay my bills on time.",
    "I feel uncomfortable if I’m not moving, even just fidgeting my fingers or jiggling my leg.",
    "I often do things that I know are risky, or even dangerous.",
    "I find it easy to sit and do a quiet task, like reading a book or watching a movie.",
    "I often butt into conversations I’m not a part of.",
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
    const score = answers.reduce((a, v) => a + v, 0);
    const level =
      score < 25
        ? "Low chance of ADHD"
        : score < 55
        ? "Moderate chance of ADHD"
        : "High chance of ADHD";

    setResult({ score, level });
  };

  return (
    <UserWrapper>
      <div style={styles.container}>
        {/* HEADER SECTION */}
        <div style={styles.headerContainer}>
          <img
            src="https://www.resilience.org/wp-content/uploads/2025/09/Dark-Triad-Thumbnail-BG-Final-2048x1152-1.webp"
            alt="ADHD Test Header"
            style={styles.headerBg}
          />
          <div style={styles.headerOverlay}></div>

          <div style={styles.headerContent}>
            <h1 style={styles.mainTitle}>ADHD Test</h1>
            <div style={styles.testMeta}>
              <span style={styles.metaBtnOrange}>✔ 20 QUESTIONS</span>
              <span style={styles.metaBtnPink}>⏱ 3 MINUTES</span>
            </div>
          </div>
        </div>

        {/* SUBSECTION */}
        <div style={styles.subSection}>
          <h2 style={styles.subTitle}>Do you have ADHD?</h2>
          <p style={styles.subDesc}>
            Symptoms of attention-deficit/hyperactivity disorder (ADHD) can
            interfere with relationships, career success, and other life goals.
            Take this quick test to find out if you might have ADHD.
          </p>
          {!started && (
            <button style={styles.startButton} onClick={() => setStarted(true)}>
              🚀 Start Test
            </button>
          )}
        </div>

        {/* IF TEST STARTED */}
        {started && (
          <>
            {/* SCALE BAR */}
            <div style={styles.scaleBar}>
              <span style={styles.scaleText}>STRONGLY DISAGREE</span>
              <span style={styles.scaleText}>NEUTRAL</span>
              <span style={styles.scaleText}>STRONGLY AGREE</span>
            </div>

            {/* QUESTIONS */}
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
                          backgroundColor:
                            answers[i] === j ? color : "transparent",
                        }}
                      />
                    ))}
                  </div>
                  <div style={styles.labelRow}>
                    <span style={styles.labelLeft}>DISAGREE</span>
                    <span style={styles.labelRight}>AGREE</span>
                  </div>
                  {i < questions.length - 1 && (
                    <div style={styles.divider}></div>
                  )}
                </div>
              ))}
            </div>

            {/* SUBMIT BUTTON */}
            <button onClick={handleSubmit} style={styles.submitButton}>
              Submit Test
            </button>

            {/* RESULTS SECTION */}
            {result && (
              <div style={styles.resultBox}>
                {result.score !== null && (
                  <p style={styles.resultScore}>
                    Your ADHD Score: {result.score}
                  </p>
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

/* ------------------- STYLES ------------------- */
const styles = {
  container: {
    background: "rgba(255,255,255,0.95)",
    width: "100vw", // full screen width
    maxWidth: "100%",
    margin: "0",
    padding: "0 0 60px",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
  },

  /* HEADER */
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
    backdropFilter: "blur(6px)",
  },
  metaBtnPink: {
    background: "rgba(236,72,153,0.9)",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "25px",
    fontWeight: "600",
    fontSize: "14px",
    backdropFilter: "blur(6px)",
  },

  /* SUBSECTION */
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
    transition: "all 0.3s ease",
  },

  /* SCALE BAR */
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
  scaleText: {
    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
  },

  /* QUESTIONS */
  questionList: {
    marginTop: "20px",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  questionBlock: {
    marginBottom: "45px",
  },
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

  /* BUTTONS & RESULTS */
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
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  resultBox: {
    marginTop: "40px",
    backgroundColor: "#f3f4f6",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
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
};
