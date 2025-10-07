import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import stethoscope from "../assets/stethoscope.png";

export default function PsychiatristSignup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    experience: "",
    qualification: "",
  });

  const [error, setError] = useState("");
  const [animatedText, setAnimatedText] = useState("");
  const navigate = useNavigate();

  const fullText =
    "At MoodAngles, we’re always focused on helping you heal minds and change lives.";

  // ✨ Animated text
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setAnimatedText((prev) => prev + fullText.charAt(index));
        index++;
      } else clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // ✏️ Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.age < 25) {
      setError("Psychiatrists must be at least 25 years old.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/psychiatrist/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Please log in.");
        navigate("/PLogin");
      } else {
        setError(data.msg || data.error || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* LEFT SIDE */}
        <div style={styles.left}>
          <p style={styles.animatedText}>{animatedText}</p>
          <img src={stethoscope} alt="stethoscope" style={styles.image} />
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.right}>
          <div style={styles.tabRow}>
            <button
              style={{ ...styles.tab, ...styles.activeTab }}
              onClick={() => navigate("/PSignup")}
            >
              Sign Up
            </button>
            <button style={styles.tab} onClick={() => navigate("/PLogin")}>
              Login
            </button>
          </div>

          <h2 style={styles.heading}>Create Psychiatrist Account</h2>

          <form style={styles.form} onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              min="25"
              required
              style={styles.input}
            />
            <input
              type="number"
              name="experience"
              placeholder="Experience (in years)"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              required
              style={styles.input}
            />

            <label style={styles.label}>Select Qualification:</label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="" disabled>
                -- Choose qualification --
              </option>
              <option value="mbbs-md-psychiatry">MBBS + MD (Psychiatry)</option>
              <option value="mbbs-dpm">MBBS + DPM</option>
              <option value="mbbs-dnb-psychiatry">
                MBBS + DNB (Psychiatry)
              </option>
              <option value="do-psychiatry">DO Psychiatry</option>
              <option value="board-psychiatrist">
                Board-certified Psychiatrist
              </option>
              <option value="mphil-clinical-psychology">
                M.Phil in Clinical Psychology
              </option>
              <option value="phd-clinical-psychology">
                PhD in Clinical Psychology
              </option>
              <option value="psyd">PsyD (Doctor of Psychology)</option>
              <option value="ma-msc-psychology">
                MA/MSc in Psychology
              </option>
              <option value="mphil-counseling-psychology">
                M.Phil in Counseling Psychology
              </option>
            </select>

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" style={styles.submit}>
              Create Account
            </button>

            <p
              style={styles.switchText}
              onClick={() => navigate("/")}
            >
              Not a psychiatrist?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eceff6",
    padding: "30px 200px",
    fontFamily: "Poppins, system-ui",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    maxWidth: "1100px",
    minHeight: "500px",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  left: {
    background: "#b3b7f0",
    flex: 0.9,
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  animatedText: {
    color: "#000",
    fontSize: "18px",
    fontWeight: "bold",
    lineHeight: 1.5,
    maxWidth: "250px",
    minHeight: "60px",
    whiteSpace: "pre-wrap",
  },
  image: {
    marginTop: "24px",
    width: "400px",
    maxWidth: "90%",
    borderRadius: "50%",
    transform: "translateX(50%)",
    objectFit: "cover",
  },
  right: {
    flex: 1.5,
    padding: "40px 60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#fff",
    overflowY: "auto",
  },
  tabRow: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    gap: "10px",
  },
  tab: {
    padding: "8px 20px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#000",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
  },
  activeTab: {
    backgroundColor: "#b3b7f0",
    border: "1px solid #b3b7f0",
    color: "#fff",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "600",
    color: "#000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "100%",
    maxWidth: "500px",
  },
  input: {
    padding: "12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    backgroundColor: "#fff",
    color: "#000",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    background: "#fff",
    color: "#000",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#000",
  },
  error: {
    color: "#b12b2b",
    background: "#feecec",
    padding: "10px",
    borderRadius: "6px",
    textAlign: "center",
    fontSize: "14px",
  },
  submit: {
    background: "#6e8efb",
    color: "#fff",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
  switchText: {
    marginTop: "12px",
    color: "#6e8efb",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "center",
  },
};
