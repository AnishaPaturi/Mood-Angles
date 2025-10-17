// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("email");
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

  const handleSendOtp = async () => {
    setError("");
    if (!contact) {
      setError(`Please enter your ${method}`);
      return;
    }

    // Simulate OTP sending
    try {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(generatedOtp);
      setOtpSent(true);
      alert(`OTP sent to your ${method}: ${generatedOtp}`); // demo only
    } catch (err) {
      setError("Failed to send OTP");
    }
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === otp) {
      setOtpVerified(true);
      setError("");
      alert("OTP verified successfully!");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError("");

    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase letter, 1 digit, and 1 special char (@ # $ _)"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    alert("Password reset successful! Redirecting to login...");
    navigate("/login");
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
        <h2>Goldfish Memory??</h2>

        {/* Method selection */}
        <div className="method-selector">
          <button
            className={method === "email" ? "active" : ""}
            onClick={() => {
              setMethod("email");
              setOtpSent(false);
              setOtpVerified(false);
            }}
          >
            Email
          </button>
          <button
            className={method === "phone" ? "active" : ""}
            onClick={() => {
              setMethod("phone");
              setOtpSent(false);
              setOtpVerified(false);
            }}
          >
            Phone
          </button>
        </div>

        <form className="form" onSubmit={handleResetPassword}>
          {/* Contact input */}
          <input
            type={method === "email" ? "email" : "tel"}
            placeholder={
              method === "email" ? "Enter your email" : "Enter your phone number"
            }
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />

          {/* Send OTP */}
          {!otpSent && (
            <button type="button" className="primary" onClick={handleSendOtp}>
              Send OTP
            </button>
          )}

          {/* Enter OTP */}
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

          {/* Password fields appear only after OTP is verified */}
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
  width: 1000px;
  max-width: 95%;
  min-height: 550px;
  background: #fff;
  border-radius: 12px;
  padding: 32px 24px;
  box-shadow: 0 18px 50px rgba(0,0,0,0.2);
  text-align: center;
}

.forgot-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
}

h2 {
  margin-bottom: 20px;
  color: #ff758c;
}

.method-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  gap: 12px;
}

.method-selector button {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #ff758c;
  background: white;
  color: #ff758c;
  cursor: pointer;
  font-weight: 600;
}

.method-selector button.active {
  background: linear-gradient(90deg, #ff7eb3, #ff758c);
  color: #fff;
  border: none;
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
}

.inputRow {
  position: relative;
  display: flex;
}

.showBtn {
  margin-left: 8px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  background: #ff758c;
  color: white;
  border-radius: 6px;
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
