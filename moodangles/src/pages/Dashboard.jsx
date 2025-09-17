import React from "react";
import { Link } from "react-router-dom";
import PAvatar from "../assets/PAvatar.png";
import UAvatar from "../assets/UAvatar.png";

export default function Dashboard() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        
        {/* === LEFT: USER SECTION === */}
        <div style={styles.leftSection}>
          {/* User Image & Label */}
          <div style={styles.imageWrapper}>
            <div style={styles.avatar}></div>
            <p style={styles.userLabel}>Users</p>
          </div>

          {/* User Buttons */}
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
          {/* Psychiatrist Image & Label */}
          <div style={styles.imageWrapper}>
            <div style={styles.avatar}></div>
            <img src="PAvatar" alt="Psychiatrist Avatar" />
            <p style={styles.userLabel}>Psychiatrist</p>
          </div>

          {/* Psychiatrist Buttons */}
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

/* === Styles === */
const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#ffffffff",
    fontFamily: "Poppins, sans-serif",
    padding: '0px 270px 0px 270px',
  },

  card: {
    display: "flex",
    width: "700px",
    height: "450px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
    background: "#fff",
  },

  /* Left Section - Users */
  leftSection: {
    width: "50%",
    background: "#dea0ebff", // Light pink background
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
  },

  /* Right Section - Psychiatrist */
  rightSection: {
    width: "50%",
    background: "#7b7bf4ff", // Light lavender background
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
  },

  /* Shared Styles for Avatar + Label */
  imageWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },

  avatar: {
    width: "160px",
    height: "160px",
    borderRadius: "80%",
    background: "#d9d9d9", // Placeholder grey
    marginBottom: "12px",
  },

  userLabel: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
  },

  /* Button Group */
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
  },
};
