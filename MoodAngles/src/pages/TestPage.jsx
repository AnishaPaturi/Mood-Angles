import React from "react";
import { useNavigate } from "react-router-dom";
import UserWrapper from "../components/UserWrapper";

function TestPage() {
  const navigate = useNavigate();

  // Each test now has a direct page route
  const tests = [
    { title: "😔 Feeling Low? Depression Test", subtitle: "Check your current mood balance.", page: "/test/depression" },
    { title: "😰 Feeling Tense? Anxiety Test", subtitle: "See if stress might be catching up to you.", page: "/test/anxiety" },
    { title: "💭 Distracted Lately? ADHD Test", subtitle: "Explore focus and attention patterns.", page: "/test/adhd" },
    { title: "🌈 Understand Yourself? Autism Traits", subtitle: "Learn about social & sensory traits.", page: "/test/autism" },
    { title: "⚡ Mood Swings? Bipolar Check", subtitle: "Discover if mood instability affects you.", page: "/test/bipolar" },
    { title: "🌀 Confused Thoughts? Neuropsychiatric Check", subtitle: "Evaluate changes in memory or behavior.", page: "/test/neuro" },
    { title: "🧩 Curious Mind? Personality Test", subtitle: "Find out how your mind shapes your world.", page: "/test/personality" },
  ];

  // Navigate directly to the page
  const handleClick = (page) => {
    navigate(page);
  };

  return (
    <UserWrapper>
      <div style={styles.page}>
        <h2 style={styles.heading}>🌿 Mood & Mind Explorer</h2>
        <p style={styles.subheading}>
          Choose the test that speaks to you today.
        </p>

        <div style={styles.grid}>
          {tests.map((test, index) => (
            <div
              key={index}
              style={styles.card}
              onClick={() => handleClick(test.page)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#93fd9cff";
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#d5fbceff";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.08)";
              }}
            >
              <h3 style={styles.cardTitle}>{test.title}</h3>
              <p style={styles.cardSubtitle}>{test.subtitle}</p>
              <button style={styles.startBtn}>Start →</button>
            </div>
          ))}
        </div>
      </div>
    </UserWrapper>
  );
}

const styles = {
  page: {
    textAlign: "center",
    minHeight: "100vh",
    background: "white",
    padding: "3rem 1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all 0.3s ease",
  },
  heading: {
    fontSize: "2.4rem",
    color: "#2e7d32",
    fontWeight: "700",
    marginBottom: "0.5rem",
  },
  subheading: {
    fontSize: "1.1rem",
    color: "#4b6043",
    marginBottom: "2.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    width: "90%",
    maxWidth: "1000px",
  },
  card: {
    background: "#d5fbceff",
    borderRadius: "1.5rem",
    padding: "2rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid #dcedc8",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#2e7d32",
    marginBottom: "0.5rem",
  },
  cardSubtitle: {
    fontSize: "0.95rem",
    color: "#4b6043",
    marginBottom: "1rem",
  },
  startBtn: {
    background: "#43a047",
    color: "#fff",
    border: "none",
    padding: "0.6rem 1.3rem",
    borderRadius: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default TestPage;
