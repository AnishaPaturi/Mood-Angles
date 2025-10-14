import React, { useState } from "react";
import UserWrapper from "../../components/UserWrapper";

export default function ADHDTest() {
  const questions = [
    "I am good at spotting patterns that other people miss.",
    "I prefer to do things the same way every time.",
    "I find it challenging to understand the unspoken rules of social interaction.",
    "People often tell me I’m being rude when I’m not trying to be.",
    "I have one or two special interests that can feel all-consuming.",
    "I am very sensitive to physical sensations, such as how my clothes feel on my body.",
    "Eye contact can be uncomfortable for me.",
    "I’m good at small talk or routine chitchat.",
    "People tell me I’m too literal.",
    "In conversations, I’m often unsure of when it’s my turn to talk.",
    "Repetitive movements, like pacing or flexing my fingers, comfort me when I’m stressed.",
    "When my routine is disrupted, it can be distressing.",
    "I like to collect or track specific types of information—for example, train schedules, historical dates, or different varieties of birds.",
    "I mimic other people’s behavior to appear “normal.”",
    "It’s easy for me to understand what others are thinking, even if they don’t say it.",
    "I can talk about my interests for hours and hours.",
    "I often miss when people say one thing but mean something else.",
    "Certain sounds that don’t seem to bother other people are very upsetting to me.",
    "I find it challenging to be in a conversation with two or more people.",
    "Imagining something that’s not real can be difficult for me."
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

    // Convert answers (0-4) to 1-5
    const adjustedAnswers = answers.map(a => a + 1);

    const rawScore = adjustedAnswers.reduce((a, v) => a + v, 0);
    const minTotal = questions.length;       // all 1s
    const maxTotal = questions.length * 5;   // all 5s

    const score = Math.round(((rawScore - minTotal) / (maxTotal - minTotal)) * 100);

    const level =
      score < 25
        ? "Low chance of Autistic Traits"
        : score < 55
        ? "Moderate chance of Autistic Traits"
        : "High chance of Autistic Traits";

    setResult({ score, level });
  };

  return (
    <UserWrapper>
      <div style={styles.container}>
        <div style={styles.headerContainer}>
          <img
            src="https://sentis.com.au/wp-content/uploads/2023/09/kys-story-news-e1694063308229.webp"
            alt="Autism Test Header"
            style={styles.headerBg}
          />
          <div style={styles.headerOverlay}></div>

          <div style={styles.headerContent}>
            <h1 style={styles.mainTitle}>Autism Traits</h1>
            <div style={styles.testMeta}>
              <span style={styles.metaBtnOrange}>✔ 20 QUESTIONS</span>
              <span style={styles.metaBtnPink}>⏱ 3 MINUTES</span>
            </div>
          </div>
        </div>

        <div style={styles.subSection}>
          <h2 style={styles.subTitle}>Could you be on the autism spectrum?</h2>
          <p style={styles.subDesc}>
            Autism, which can include social challenges, repetitive behaviors, and differences in information processing, may go undiagnosed until adulthood, particularly for those who are high-functioning. Take this test to determine if you may be showing signs of autism.
          </p>
          {!started && (
            <button style={styles.startButton} onClick={() => setStarted(true)}>
              🚀 Start Test
            </button>
          )}
        </div>

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

            <button onClick={handleSubmit} style={styles.submitButton}>
              Submit Test
            </button>

            {result && (
              <div style={styles.resultBox}>
                {result.score !== null && (
                  <p style={styles.resultScore}>
                    Your Autism Traits Score: {result.score}/100
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
