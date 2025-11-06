import React from "react";
import UserWrapper from "../components/UserWrapper"; // ← add this

function safeNavigate(path) {
  try {
    if (typeof window !== "undefined" && typeof window.__navigate === "function") {
      window.__navigate(path);
      return;
    }
  } catch (e) {}
  if (typeof window !== "undefined") {
    try {
      const url = new URL(path, window.location.origin);
      if (
        url.origin === window.location.origin &&
        window.history &&
        window.history.pushState
      ) {
        window.history.pushState({}, "", url.pathname + url.search + url.hash);
        window.dispatchEvent(new PopStateEvent("popstate"));
        return;
      }
    } catch (e) {}
    window.location.assign(path);
  }
}

export default function PDashboard() {
  return (
    <UserWrapper> {/* ← WRAP EVERYTHING INSIDE THIS */}
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>Connecting to Psychiatrist soon...</h2>
          <p style={styles.sub}>Solve your queries with a chat bot here</p>

          <button
            style={styles.button}
            onClick={() => safeNavigate("/ChatBot")}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#4f46e5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}
          >
            Go to Chatbot
          </button>
        </div>
      </div>
    </UserWrapper>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f5fb",
    fontFamily: "Poppins, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    padding: 20,
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "100%",
    minHeight: "60vh", 
    borderRadius: "14px",
    padding: "64px 48px", 
    background: "#fff",
    boxShadow: "0 15px 50px rgba(0,0,0,0.12)",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: 22,
    color: "#111827",
    marginBottom: 12,
  },
  sub: {
    margin: 0,
    color: "#6b7280",
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    padding: "12px 22px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
    transition: "background 0.18s ease",
  },
};
