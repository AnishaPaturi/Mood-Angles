import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import stethoscope from "../assets/stethoscope.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [displayedText, setDisplayedText] = useState("");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const fullText =
    "   At MoodAngles are always fully focused on helping your mental health.";

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + fullText.charAt(i));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [fullText]);

  // Switch tabs
  const handleSwitch = (tab) => {
    setActiveTab(tab);
    navigate(tab === "signup" ? "/PSignup" : "/PLogin");
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/psychiatrist/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Save JWT to localStorage
        localStorage.setItem("psychiatristToken", data.token);
        // Redirect to psychiatrist dashboard
        navigate("/psychiatrist-dashboard");
      } else {
        setError(data.msg || data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#c7c7d9",
        padding: "10px 350px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          background: "#fff",
          borderRadius: "16px",
          overflow: "hidden",
          maxWidth: "900px",
          width: "90%",
          height: "500px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            background: "#b3b7f0",
            color: "#fff",
            flex: 0.9,
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <span role="img" aria-label="mobile">
            📱
          </span>
          <p
            style={{
              color: "#000",
              fontSize: "18px",
              fontWeight: "bold",
              fontFamily: "'Roboto', sans-serif",
              lineHeight: 1.5,
              maxWidth: "220px",
              minHeight: "60px",
              whiteSpace: "pre-wrap",
            }}
          >
            {displayedText}
          </p>
          <img
            src={stethoscope}
            alt="Decorative stethoscope"
            style={{
              marginTop: "24px",
              width: "450px",
              maxWidth: "90%",
              alignSelf: "flex-end",
              borderRadius: "50%",
              transform: "translateX(50%)",
              objectFit: "cover",
            }}
          />
        </div>

        {/* RIGHT PANEL - LOGIN FORM */}
        <div
          style={{
            flex: 1,
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Toggle */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
              gap: "10px",
            }}
          >
            <button
              onClick={() => handleSwitch("login")}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border: "1px solid #d7d7f5",
                backgroundColor: activeTab === "login" ? "#d7d7f5" : "#fff",
                color: activeTab === "login" ? "#333" : "#555",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.3s ease",
              }}
            >
              Login
            </button>
            <button
              onClick={() => handleSwitch("signup")}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border: "1px solid #d7d7f5",
                backgroundColor: activeTab === "signup" ? "#d7d7f5" : "#fff",
                color: activeTab === "signup" ? "#333" : "#555",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.3s ease",
              }}
            >
              Signup
            </button>
          </div>

          <h2
            style={{
              textAlign: "center",
              fontSize: "22px",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#000",
            }}
          >
            Login
          </h2>

          <form
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#fff",
                color: "#000",
                fontSize: "14px",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#fff",
                color: "#000",
                fontSize: "14px",
              }}
            />

            {error && (
              <div style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                background: "#6366f1",
                color: "#fff",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                marginTop: "10px",
                transition: "0.3s",
              }}
            >
              Login
            </button>

            {/* ===== Added Statement ===== */}
            <p
              style={{
                marginTop: "12px",
                color: "#6366f1",
                cursor: "pointer",
                fontSize: "14px",
                textAlign: "center",
              }}
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
