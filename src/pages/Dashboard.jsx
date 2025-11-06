import React from "react";
import { Link } from "react-router-dom";
import PAvatar from "../assets/PAvatar.png";
import UAvatar from "../assets/UAvatar.png";
import "./Dashboard.css"; // ⬅️ Styles for animations + dots

export default function Dashboard() {
  return (
    <div style={styles.page} className="page">
      {/* === Title === */}
      <h1 style={styles.title}>Mood Angles</h1>

      <div style={styles.card}>
        {/* === LEFT: USER SECTION === */}
        <div style={styles.leftSection}>
          <div style={styles.imageWrapper}>
            <img src={UAvatar} alt="User Avatar" style={styles.avatarImg} />
            <p style={styles.userLabel}>Users</p>
          </div>

          <div style={styles.buttonGroup}>
            <Link to="/login">
              <button style={styles.tealBtn}>Login</button>
            </Link>
            <Link to="/signup">
              <button style={styles.tealBtn}>Sign Up</button>
            </Link>
          </div>
        </div>

        {/* === RIGHT: PSYCHIATRIST SECTION === */}
        <div style={styles.rightSection}>
          <div style={styles.imageWrapper}>
            <img src={PAvatar} alt="Psychiatrist Avatar" style={styles.avatarImg} />
            <p style={styles.userLabel}>Psychiatrist</p>
          </div>

          <div style={styles.buttonGroup}>
            <Link to="/PLogin">
              <button style={styles.tealBtn}>Login</button>
            </Link>
            <Link to="/PSignup">
              <button style={styles.tealBtn}>Sign Up</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* === Inline Styles for Layout Only === */
const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#ffffff", // ⬅️ WHITE background now
    fontFamily: "Poppins, sans-serif",
    padding: "0px 270px",
    position: "relative",
    overflow: "hidden",
  },

  title: {
    fontSize: "40px",
    fontWeight: "700",
    color: "#000", // darker title since background is white
    marginBottom: "40px",
    opacity: 0,
    animation: "fadeIn 2s ease forwards",
    zIndex: 2,
  },

  card: {
    display: "flex",
    width: "700px",
    height: "450px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
    background: "#fffaf0",
    position: "relative",
    zIndex: 2,
  },

  leftSection: {
    width: "50%",
    background: "#dea0ebff",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
  },

  rightSection: {
    width: "50%",
    background: "#7b7bf4ff",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
  },

  imageWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },

  avatarImg: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
  },

  userLabel: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
  },

  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
    marginTop: "20px",
    padding: "40px 40px 80px 40px",
  },

  tealBtn: {
    padding: "10px 0",
    background: "#000000e9",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    width: "100%",
    transition: "transform 0.2s ease, background 0.3s ease",
  },
};
