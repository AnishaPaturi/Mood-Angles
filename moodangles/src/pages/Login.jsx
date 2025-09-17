import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$_])[A-Za-z\d@#$_]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase letter, 1 digit and 1 special char from @ # $ _"
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store JWT token for SPA
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.msg || data.error || "Invalid credentials");
      }
    } catch (err) {
      console.warn("Backend unavailable — navigating for UI testing");
      navigate("/dashboard");
    }
  };

  const handleGoogle = () => {
    // Open Google OAuth in a popup
    const width = 500, height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      "http://localhost:5000/api/auth/google",
      "Google Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const messageListener = (event) => {
      if (event.origin !== "http://localhost:5000") return;

      const { token, error } = event.data;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
      }
      if (error) setError(error);

      window.removeEventListener("message", messageListener);
      popup.close();
    };

    window.addEventListener("message", messageListener);
  };

  return (
    <div className="login-page">
      <style>{css}</style>

      <div className="card">
        {/* LEFT PANEL */}
        <div className="left">
          <div className="left-decor deco1" />
          <div className="left-decor deco2" />
          <div className="left-decor deco3" />
          <div className="brand">
            <h1>Mood</h1>
            <h1>Angles</h1>
          </div>

          <div
            className={`notch ${tab === "signup" ? "notch-signup" : ""}`}
            role="tablist"
          >
            <button
              className={`tab ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
            >
              LOGIN
            </button>
            <button
              className={`tab ${tab === "signup" ? "active" : ""}`}
              onClick={() => {
                setTab("signup");
                navigate("/signup");
              }}
            >
              SIGN UP
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right">
          <h2>{tab === "login" ? "LOGIN" : "SIGN UP"}</h2>

          {tab === "login" ? (
            <form className="form" onSubmit={handleSubmit} noValidate>
              <div className="inputRow">
                <span className="icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#9aa4ad"
                      d="M2 6v12h20V6L12 13 2 6zM20 5c.55 0 1 .45 1 1v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6c0-.55.45-1 1-1h16z"
                    ></path>
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="inputRow">
                <span className="icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#9aa4ad"
                      d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zm-7 0V6a2 2 0 114 0v2h-4z"
                    ></path>
                  </svg>
                </span>

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <span className="pw-info" tabIndex={0} aria-label="password rules">
                  ⓘ
                  <span className="tooltip">
                    Password rules:
                    <br />• Minimum 8 characters
                    <br />• At least 1 uppercase letter
                    <br />• At least 1 digit
                    <br />• One special char: <b>@ # $ _</b>
                  </span>
                </span>
              </div>

              <div className="row between">
                <div style={{ height: 24 }} />
                <a onClick={() => navigate("/forgot-password")} className="forgot">
                  Forgot Password?
                </a>
              </div>

              {error && <div className="error">{error}</div>}

              <button className="primary" type="submit">
                LOGIN
              </button>

              {/* ===== Added Not a user link ===== */}
              <p
                style={{
                  marginTop: "12px",
                  color: "#ff758c",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => navigate("/")}
              >
                Not a user? 
              </p>
            </form>
          ) : (
            <div className="signup-placeholder">
              <p>Signup UI will be implemented later — click SIGN UP here to switch.</p>
              <button className="primary" onClick={() => navigate("/signup")}>
                Create Account
              </button>
            </div>
          )}

          <div className="divider" />
          <div className="social">
            <span>Or Login with</span>
            <button className="google" onClick={handleGoogle} title="Sign in with Google">
              <svg width="18" height="18" viewBox="0 0 533.5 544.3">
                <path fill="#4285F4" d="M533.5 278.4c0-17.8-1.6-35.4-4.8-52.4H272v99.6h147.2c-6.4 34.8-26.4 64.2-56.3 83.7v69.6h90.9c53.2-49 83.7-121.2 83.7-200.5z"/>
                <path fill="#34A853" d="M272 544.3c74.8 0 137.6-24.9 183.5-67.6l-90.9-69.6c-25.3 17-57.7 27-92.6 27-71 0-131.2-47.9-152.8-112.6H23.8v70.8C69.6 480.6 163.2 544.3 272 544.3z"/>
                <path fill="#FBBC05" d="M119.2 325.8c-8.9-26.4-8.9-54.6 0-81l-95.4-70.8C3.5 217.7 0 244.9 0 272c0 27.1 3.5 54.3 23.8 97.9l95.4-70.1z"/>
                <path fill="#EA4335" d="M272 107.7c39.8 0 75.7 14 104 40.9l78-78C405.3 19.9 346.2 0 272 0 163.2 0 69.6 63.7 23.8 160.5l95.4 70.8C140.8 155.6 201 107.7 272 107.7z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
:root{
  --pink1:#ff7eb3;
  --pink2:#ff758c;
  --cardW:980px;
  --cardH:560px;
  --white:#ffffff;
  --dark:#222326;
}

/* Page */
// .login-page{
//   min-height:100vh;
//   display:flex;
//   align-items:center;
//   justify-content:center;
//   background:#2f3132;
//   font-family: "Poppins", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
//   padding:24px;
// }

/* Card */
.card{
  width:var(--cardW);
  max-width:95%;
  height:var(--cardH);
  background:transparent;
  display:flex;
  border-radius:12px;
  box-shadow: 0 18px 50px rgba(0,0,0,0.7);
  overflow:hidden;
  position:relative;
}
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: #f7cbd4ff;
  font-family: "Poppins", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  padding: 10px 150px 10px 150px;
  box-sizing: border-box;
}

// .card {
//   margin: 0 auto;
// }


/* LEFT PANEL */
.left{
  width:40%;
  position:relative;
  padding:36px 28px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  color:white;
  background: linear-gradient(135deg, var(--pink1), var(--pink2));
}

/* layered diagonal bands */
.left-decor{
  position:absolute;
  border-radius:18px;
  filter: blur(0.2px);
  opacity:0.9;
}
.left-decor.deco1{
  width:240px;
  height:240px;
  top:-40px;
  left:-40px;
  transform: rotate(30deg);
  background:linear-gradient(45deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02));
}
.left-decor.deco2{
  width:420px;
  height:420px;
  bottom:-110px;
  left:-110px;
  transform: rotate(18deg);
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(0,0,0,0));
}
.left-decor.deco3{
  width:380px;
  height:240px;
  top:90px;
  left:-80px;
  transform: rotate(-10deg);
  background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0));
}

/* brand text on the left */
.brand{
  position:relative;
  z-index:2;
  text-align:center;
}
.brand h1{ margin:0; font-size:34px; letter-spacing:1px; }
.brand p{ margin:6px 0 0; opacity:0.95; font-weight:500; }

/* white curved notch that overlaps into right panel */
.notch{
  position:absolute;
  right:-58px;
  top:36%;
  width:168px;
  height:150px;
  background: #fff;
  border-radius:90px 0 0 90px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  box-shadow: 0 8px 18px rgba(0,0,0,0.12);
  z-index:3;
  gap:6px;
  padding-left:6px;
}
.notch .tab{
  font-size:13px;
  font-weight:700;
  border:none;
  background:transparent;
  color:#888;
  cursor:pointer;
  padding:6px 12px;
}
.notch .tab.active{
  background:linear-gradient(90deg, var(--pink1), var(--pink2));
  color:#fff;
  border-radius:18px;
  box-shadow: 0 6px 12px rgba(255,110,150,0.12);
}
.notch-signup{ right:-64px; } /* small tweak when sign up active */

/* RIGHT PANEL */
.right{
  width:60%;
  background:var(--white);
  padding:44px 48px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:12px;
  position:relative;
}

/* logo placeholder */
.logo{
  width:88px;
  height:88px;
  object-fit:cover;
  border-radius:12px;
  margin-top:8px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
}

/* title */
.right h2{
  margin:8px 0 18px;
  color: #ff758c;
  letter-spacing:2px;
}

/* form */
.form{ width:86%; display:flex; flex-direction:column; gap:12px; align-items:stretch; }

/* Input row with left icon */
/* Input row with left icon */
.inputRow{
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;              /* white background */
  border: 1px solid #e6e6e6;     /* light border */
  border-radius: 8px;            /* rounded edges */
  padding: 4px 8px;              /* inner spacing */
}
.inputRow .icon{
  position: absolute;
  left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  height: 100%;
}
.inputRow input{
  width: 100%;
  padding: 10px 12px 10px 36px;  /* more left padding to fit icon */
  border: none;                  /* remove bottom-only border */
  font-size: 14px;
  outline: none;
  color: #333;
  background: transparent;       /* let parent white show through */
}
.inputRow input:focus{
  border: none;
  box-shadow: 0 0 0 2px rgba(255,117,140,0.25); /* subtle focus glow */
  transform: translateY(-1px);
}


/* password info tooltip */
.pw-info{
  margin-left:8px;
  font-size:13px;
  color:#999;
  cursor:default;
  position:relative;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:24px;
  height:24px;
  border-radius:50%;
  background:transparent;
  border:none;
}
.pw-info .tooltip{
  position:absolute;
  left:28px;
  bottom:calc(100% + 6px);
  min-width:200px;
  background:#222;
  color:#fff;
  padding:10px;
  border-radius:8px;
  font-size:12px;
  line-height:1.2;
  display:none;
  box-shadow: 0 12px 30px rgba(0,0,0,0.28);
  z-index:40;
}
.pw-info:hover .tooltip,
.pw-info:focus .tooltip{
  display:block;
}

/* forgot link & layout helpers */
.row.between{
  display:flex;
  justify-content:flex-end;
  align-items:center;
}
.forgot{
  font-size:13px;
  color:#ff758c;
  cursor:pointer;
  text-decoration:none;
}
.forgot:hover{ text-decoration:underline; }

/* primary button */
.primary{
  margin-top:8px;
  background: linear-gradient(90deg,var(--pink1),var(--pink2));
  color:#fff;
  border:none;
  padding:12px 18px;
  border-radius:28px;
  font-weight:700;
  cursor:pointer;
  font-size:15px;
  box-shadow: 0 10px 26px rgba(255,110,150,0.12);
}
.primary:hover{ transform:translateY(-2px); }

/* error */
.error{
  color:#b12b2b;
  background: #feecec;
  padding:8px 10px;
  border-radius:6px;
  font-size:13px;
}

/* divider */
.divider{
  width:86%;
  height:1px;
  background:#f0f0f0;
  margin-top:10px;
  margin-bottom:8px;
}

/* social area (google) */
.social{
  width:86%;
  display:flex;
  flex-direction:column;
  gap:10px;
  align-items:center;
}
.social span{ color:#888; font-size:13px; }

.google{
  border:1px solid #e7e7e7;
  background:#fff;
  padding:10px 16px;
  border-radius:28px;
  display:inline-flex;
  gap:10px;
  align-items:center;
  cursor:pointer;
  font-weight:600;
  font-size:14px;
}
.google svg{ display:block; }
.google:hover{ background:#fbfbfb; }

/* small screens */
@media (max-width:880px){
  .card{ flex-direction:column; height:auto; width:95%; }
  .left{ width:100%; height:220px; border-radius:12px 12px 0 0; }
  .right{ width:100%; border-radius:0 0 12px 12px; padding:28px; }
  .notch{ display:none; }
}
` ;
