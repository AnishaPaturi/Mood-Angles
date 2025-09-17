import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import stethoscope from "../assets/stethoscope.png";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signup");
  const navigate = useNavigate();

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

  const fullText =
    "  At MoodAngles are always fully focused on helping your mental health.";

  // Animate text letter by letter
  useEffect(() => {
    let index = 0;
    setAnimatedText(""); 
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setAnimatedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle signup submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
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
        alert("Signup successful! Please login.");
        navigate("/PLogin");
      } else {
        setError(data.msg || data.error || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eceff6",
        fontFamily:
          "Poppins, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        padding: "30px 250px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "90%",
          maxWidth: "1100px",
          minHeight: "500px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        {/* LEFT SECTION */}
        <div
          style={{
            background: "#b3b7f0",
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
            {animatedText}
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

        {/* RIGHT SECTION - SIGNUP FORM */}
        <div
          style={{
            flex: 1.5,
            padding: "40px 60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#fff",
            overflowY: "auto",
            maxHeight: "500px",
          }}
        >
          {/* Toggle Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setActiveTab("signup")}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border:
                  activeTab === "signup" ? "1px solid #b3b7f0" : "1px solid #ccc",
                backgroundColor: activeTab === "signup" ? "#b3b7f0" : "#fff",
                color: activeTab === "signup" ? "#fff" : "#000",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Sign Up
            </button>

            <button
              onClick={() => navigate("/PLogin")}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border:
                  activeTab === "login" ? "1px solid #b3b7f0" : "1px solid #ccc",
                backgroundColor: activeTab === "login" ? "#b3b7f0" : "#fff",
                color: activeTab === "login" ? "#fff" : "#000",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Login
            </button>
          </div>

          <h2
            style={{
              marginBottom: "20px",
              fontSize: "26px",
              color: "#000",
              textAlign: "center",
            }}
          >
            Create Account
          </h2>

          {/* Signup Form */}
          {activeTab === "signup" && (
            <form
              onSubmit={handleSubmit}
              noValidate
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                min="25"
                required
                style={inputStyle}
              />
              <input
                type="number"
                name="experience"
                placeholder="Experience (in years)"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                required
                style={inputStyle}
              />

              <label
                style={{
                  fontSize: "14px",
                  color: "#000",
                  fontWeight: "500",
                  marginBottom: "-10px",
                }}
              >
                Select Qualification:
              </label>
              <select
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  backgroundColor: "#fff",
                  height: "45px",
                  padding: "10px",
                  fontSize: "14px",
                  color: "#000",
                }}
              >
                <option value="" disabled>
                  -- Choose a qualification --
                </option>
                <option value="mbbs-md-psychiatry">MBBS + MD (Psychiatry)</option>
                <option value="mbbs-dpm">MBBS + DPM</option>
                <option value="mbbs-dnb-psychiatry">MBBS + DNB (Psychiatry)</option>
                <option value="do-psychiatry">DO Psychiatry</option>
                <option value="board-psychiatrist">Board-certified Psychiatrist</option>
                <option value="mphil-clinical-psychology">
                  M.Phil in Clinical Psychology
                </option>
                <option value="phd-clinical-psychology">
                  PhD in Clinical Psychology
                </option>
                <option value="psyd">PsyD (Doctor of Psychology)</option>
                <option value="ma-msc-psychology">MA/MSc in Psychology</option>
                <option value="mphil-counseling-psychology">
                  M.Phil in Counseling Psychology
                </option>
              </select>

              {error && (
                <div
                  style={{
                    color: "#b12b2b",
                    background: "#feecec",
                    padding: "10px",
                    borderRadius: "6px",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                style={{
                  background: "#6e8efb",
                  color: "#fff",
                  padding: "14px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Create Account
              </button>

              {/* ===== Added Statement ===== */}
              <p
                style={{
                  marginTop: "12px",
                  color: "#6e8efb",
                  cursor: "pointer",
                  fontSize: "14px",
                  textAlign: "center",
                }}
                onClick={() => navigate("/")}
              >
                Not a psychiatrist? 
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  fontSize: "14px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: "#fff",
  color: "#000",
};
