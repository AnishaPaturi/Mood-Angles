// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$_])[A-Za-z\d@#$_]{8,}$/;

  // ✅ UPDATED: Send OTP via backend mailer
  const handleSendOtp = async () => {
    setError("");
    if (!contact) {
      setError("Please enter your email");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: contact }),
      });

      const data = await response.json();
      if (data.success) {
        setOtp(data.otp);
        setOtpSent(true);
        alert("✅ OTP has been sent to your email!");
      } else {
        setError("❌ Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Server error while sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
  setError("");
  try {
    const response = await fetch("http://localhost:5000/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: contact, otp: enteredOtp }),
    });

    const data = await response.json();
    if (data.success) {
      setOtpVerified(true);
      alert("🎉 OTP verified successfully!");
    } else {
      setError(data.message || "Invalid OTP. Please try again.");
    }
  } catch (err) {
    console.error(err);
    setError("⚠️ Server error while verifying OTP");
  }
};

const handleResetPassword = async (e) => {
  e.preventDefault();
  setError("");

  if (!passwordRegex.test(newPassword)) {
    setError(
      "Password must be at least 8 characters, include 1 uppercase letter, 1 digit, and 1 special character (@ # $ _)"
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: contact, newPassword }),
    });

    const data = await response.json();
    if (data.success) {
      alert("✅ Password reset successful! Redirecting to login...");
      navigate("/login");
    } else {
      setError(data.message || "Error resetting password");
    }
  } catch (err) {
    console.error(err);
    setError("⚠️ Server error while resetting password");
  }
};


  return (
    <div className="forgot-page">
      <style>{css}</style>
      <div className="forgot-card">
        <img
          src="https://i.pinimg.com/736x/c4/f5/07/c4f507ecc55ea46e952e376cd9aed55e.jpg"
          alt="Decorative"
          className="forgot-img"
        />
        <h2>
          Goldfish Memory??? <span className="fish">🐠🐠</span>
        </h2>

        <form className="form" onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />

          {!otpSent && (
            <button type="button" className="primary" onClick={handleSendOtp}>
              Send OTP
            </button>
          )}

          {otpSent && !otpVerified && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                required
              />
              <button type="button" className="primary" onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </>
          )}

          {otpVerified && (
            <>
              <div className="inputRow">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="showBtn"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && <div className="error">{error}</div>}

              <button type="submit" className="primary">
                Reset Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

const css = `
.forgot-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f7cbd4ff;
  font-family: "Poppins", system-ui;
  padding: 20px;
}

.forgot-card {
  width: 600px;
  max-width: 95%;
  min-height: 480px;
  background: #fff;
  border-radius: 16px;
  padding: 32px 28px;
  box-shadow: 0 15px 45px rgba(0,0,0,0.18);
  text-align: center;
  transition: all 0.3s ease;
}

.forgot-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.forgot-img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}

h2 {
  margin-bottom: 20px;
  color: #ff758c;
  font-weight: 700;
  font-size: 1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.fish {
  display: inline-block;
  animation: swim 2.5s ease-in-out infinite;
}

@keyframes swim {
  0% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(5px) rotate(5deg); }
  50% { transform: translateX(0) rotate(0deg); }
  75% { transform: translateX(-5px) rotate(-5deg); }
  100% { transform: translateX(0) rotate(0deg); }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  outline: none;
  font-size: 0.95rem;
}

.inputRow {
  display: flex;
  align-items: center;
  gap: 8px;
}

.showBtn {
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
  border: none;
  background: #ff758c;
  color: white;
  border-radius: 8px;
}

.primary {
  margin-top: 8px;
  background: linear-gradient(90deg, #ff7eb3, #ff758c);
  color: #fff;
  border: none;
  padding: 12px 18px;
  border-radius: 28px;
  font-weight: 700;
  cursor: pointer;
}

.primary:hover {
  transform: translateY(-2px);
}

.error {
  color: #b12b2b;
  background: #feecec;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
}
`;
