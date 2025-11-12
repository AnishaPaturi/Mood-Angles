// frontend/src/pages/RequestInvite.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PAvatar from "../assets/PAvatar.png";
import "../pages/Dashboard.css"; // animated background if used elsewhere

export default function RequestInvite() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    qualification: "",
    experience: "",
    message: "",
  });

  const [status, setStatus] = useState({ msg: "", ok: null });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ msg: "", ok: null });

    try {
      const res = await fetch("http://localhost:5000/api/invite/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({
          msg: "✅ Request submitted successfully! Redirecting to signup...",
          ok: true,
        });

        // keep on page 10 seconds before redirecting
        setTimeout(() => {
          const emailParam = encodeURIComponent(form.email || "");
          navigate(`/psignup?email=${emailParam}`);
        }, 10000);
      } else {
        setStatus({
          msg: data.msg || data.error || "❌ Submission failed. Try again.",
          ok: false,
        });
      }
    } catch (err) {
      console.error("Request error:", err);
      setStatus({
        msg: "⚠️ Server error. Please try again later.",
        ok: false,
      });
    }
  };

  return (
    <div className="page no-dots" style={styles.page}>
      <h1 style={styles.title}>Join as a Psychiatrist</h1>

      <div style={styles.card}>
        {/* LEFT SIDE — Avatar / Visuals */}
        <div style={styles.leftSection}>
          <img
            src={PAvatar}
            alt="Psychiatrist Avatar"
            style={styles.avatarImg}
          />
          <p style={styles.subtitle}>We’re glad you’re here 💙</p>
        </div>

        {/* RIGHT SIDE — Form */}
        <div style={styles.rightSection}>
          <h2 style={styles.heading}>Request an Invite</h2>

          <form style={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <select
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">-- Select Qualification --</option>
              <option value="MBBS + MD">MBBS + MD (Psychiatry)</option>
              <option value="MBBS + DPM">MBBS + DPM</option>
              <option value="MBBS + DNB">MBBS + DNB (Psychiatry)</option>
              <option value="PhD">PhD in Clinical Psychology</option>
              <option value="M.Phil">M.Phil in Counseling Psychology</option>
              <option value="PsyD">PsyD (Doctor of Psychology)</option>
            </select>
            <input
              type="number"
              name="experience"
              placeholder="Years of Experience"
              value={form.experience}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <textarea
              name="message"
              placeholder="Message (optional)"
              value={form.message}
              onChange={handleChange}
              rows="3"
              style={styles.textarea}
            />

            {status.msg && (
              <div
                style={{
                  color: status.ok ? "green" : "#b12b2b",
                  background: status.ok ? "#eafbea" : "#feecec",
                  padding: "10px",
                  borderRadius: "6px",
                  textAlign: "center",
                  fontSize: "14px",
                  marginTop: "8px",
                }}
              >
                {status.msg}
              </div>
            )}

            <button type="submit" style={styles.submitBtn}>
              Send Request
            </button>

            <p style={styles.backLink} onClick={() => navigate("/")}>
              ← Back to Home
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins, sans-serif",
    overflow: "hidden",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "black",
    marginBottom: "30px",
    zIndex: 2,
    textAlign: "center",
    textShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },

  card: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    maxWidth: "950px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    background:
      "linear-gradient(135deg, #b3b7f0 0%, #7b7bf4 50%, #dea0eb 100%)",
    position: "relative",
    zIndex: 2,
  },

  leftSection: {
    flex: 1,
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.15)",
    padding: "20px",
  },

  avatarImg: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "20px",
    border: "3px solid rgba(255,255,255,0.6)",
  },

  subtitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#fff",
    textAlign: "center",
  },

  rightSection: {
    flex: 1,
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#ffffffcc", // slightly tinted white
    backdropFilter: "blur(5px)",
  },

  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    padding: "12px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    width: "100%",
  },

  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    width: "100%",
    background: "#fff",
  },

  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    width: "100%",
    resize: "none",
  },

  submitBtn: {
    marginTop: "8px",
    padding: "12px 0",
    background: "#6e8efb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  backLink: {
    marginTop: "12px",
    textAlign: "center",
    color: "#333",
    fontSize: "14px",
    cursor: "pointer",
  },
};
