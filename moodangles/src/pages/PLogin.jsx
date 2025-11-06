// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import stethoscope from "../assets/stethoscope.png";

// export default function PLogin() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("login");
//   const [displayedText, setDisplayedText] = useState("");

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const fullText =
//     "   At MoodAngles, we are always fully focused on helping your mental health.";

//   // Redirect if already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("psychiatristToken");
//     if (token) navigate("/psychiatrist-dashboard");
//   }, [navigate]);

//   // Typewriter effect
//   useEffect(() => {
//     let i = 0;
//     setDisplayedText("");
//     const interval = setInterval(() => {
//       setDisplayedText((prev) => prev + fullText.charAt(i));
//       i++;
//       if (i >= fullText.length) clearInterval(interval);
//     }, 50);
//     return () => clearInterval(interval);
//   }, [fullText]);

//   // Tab switch handler
//   const handleSwitch = (tab) => {
//     setActiveTab(tab);
//     navigate(tab === "signup" ? "/PSignup" : "/PLogin");
//   };

//   // Login submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/auth/psychiatrist/login",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: email.trim(), password: password.trim() }),
//         }
//       );

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("psychiatristToken", data.token);
//         navigate("/psychiatrist-dashboard");
//       } else {
//         setError(data.msg || data.error || "Invalid credentials");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Server error. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         backgroundColor: "#c7c7d9",
//         padding: "10px 350px",
//         boxSizing: "border-box",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           background: "#fff",
//           borderRadius: "16px",
//           overflow: "hidden",
//           maxWidth: "900px",
//           width: "90%",
//           height: "500px",
//           boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//           transition: "all 0.3s ease",
//         }}
//       >
//         {/* LEFT PANEL */}
//         <div
//           style={{
//             background: "#b3b7f0",
//             color: "#fff",
//             flex: 0.9,
//             padding: "40px",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             textAlign: "center",
//           }}
//         >
//           <span role="img" aria-label="mobile">
//             📱
//           </span>
//           <p
//             style={{
//               color: "#000",
//               fontSize: "18px",
//               fontWeight: "bold",
//               fontFamily: "'Roboto', sans-serif",
//               lineHeight: 1.5,
//               maxWidth: "220px",
//               minHeight: "60px",
//               whiteSpace: "pre-wrap",
//             }}
//           >
//             {displayedText}
//           </p>
//           <img
//             src={stethoscope}
//             alt="Decorative stethoscope"
//             style={{
//               marginTop: "24px",
//               width: "450px",
//               maxWidth: "90%",
//               alignSelf: "flex-end",
//               borderRadius: "50%",
//               transform: "translateX(50%)",
//               objectFit: "cover",
//             }}
//           />
//         </div>

//         {/* RIGHT PANEL */}
//         <div
//           style={{
//             flex: 1,
//             padding: "40px",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             position: "relative",
//           }}
//         >
//           {/* Toggle */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               marginBottom: "20px",
//               gap: "10px",
//             }}
//           >
//             <button
//               onClick={() => handleSwitch("login")}
//               style={{
//                 padding: "8px 20px",
//                 borderRadius: "20px",
//                 border: "1px solid #d7d7f5",
//                 backgroundColor: activeTab === "login" ? "#d7d7f5" : "#fff",
//                 color: activeTab === "login" ? "#333" : "#555",
//                 cursor: "pointer",
//                 fontSize: "14px",
//                 transition: "all 0.3s ease",
//               }}
//             >
//               Login
//             </button>
//             <button
//               onClick={() => handleSwitch("signup")}
//               style={{
//                 padding: "8px 20px",
//                 borderRadius: "20px",
//                 border: "1px solid #d7d7f5",
//                 backgroundColor: activeTab === "signup" ? "#d7d7f5" : "#fff",
//                 color: activeTab === "signup" ? "#333" : "#555",
//                 cursor: "pointer",
//                 fontSize: "14px",
//                 transition: "all 0.3s ease",
//               }}
//             >
//               Signup
//             </button>
//           </div>

//           <h2
//             style={{
//               textAlign: "center",
//               fontSize: "22px",
//               fontWeight: "bold",
//               marginBottom: "20px",
//               color: "#000",
//             }}
//           >
//             Login
//           </h2>

//           <form
//             style={{ display: "flex", flexDirection: "column", gap: "15px" }}
//             onSubmit={handleSubmit}
//           >
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={inputStyle}
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={inputStyle}
//             />

//             {error && (
//               <div style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 ...buttonStyle,
//                 background: "#6366f1",
//               }}
//               onMouseEnter={(e) => (e.target.style.background = "#4f46e5")}
//               onMouseLeave={(e) => (e.target.style.background = "#6366f1")}
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             {/* Forgot password */}
//             <p
//               style={{
//                 color: "#555",
//                 textAlign: "center",
//                 fontSize: "13px",
//                 cursor: "pointer",
//                 textDecoration: "underline",
//               }}
//               onClick={() => navigate("/forgot-password")}
//             >
//               Forgot Password?
//             </p>

//             {/* Not a psychiatrist */}
//             <p
//               style={{
//                 marginTop: "12px",
//                 color: "#6366f1",
//                 cursor: "pointer",
//                 fontSize: "14px",
//                 textAlign: "center",
//               }}
//               onClick={() => navigate("/")}
//             >
//               Not a psychiatrist?
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// const inputStyle = {
//   padding: "10px",
//   border: "1px solid #ccc",
//   borderRadius: "8px",
//   background: "#fff",
//   color: "#000",
//   fontSize: "14px",
// };

// const buttonStyle = {
//   padding: "12px",
//   border: "none",
//   borderRadius: "8px",
//   cursor: "pointer",
//   fontSize: "16px",
//   marginTop: "10px",
//   color: "#fff",
//   fontWeight: "bold",
//   transition: "0.3s",
// };
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import stethoscope from "../assets/stethoscope.png";

export default function PLogin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [displayedText, setDisplayedText] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fullText =
    "   At MoodAngles, we are always fully focused on helping your mental health.";

  // Redirect if already logged in
  useEffect(() => {
    const psyId = localStorage.getItem("psychiatristId") || localStorage.getItem("token");
    if (psyId) navigate("/PDashboard");
  }, [navigate]);

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

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$_])[A-Za-z\d@#$_]{8,}$/;

  const handleSwitch = (tab) => {
    setActiveTab(tab);
    navigate(tab === "signup" ? "/PSignup" : "/PLogin");
  };

  const handleGoogle = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase letter, 1 digit, and 1 special char (@ # $ _)"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/psychiatrist/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        // store token if provided, else store psy id
        const token = data.token || data.psyId || data.psychiatristId;
        const psy = data.user || data.psychiatrist || {};

        if (token) {
          if (remember) {
            localStorage.setItem("token", token);
            localStorage.setItem("psychiatrist", JSON.stringify(psy));
          } else {
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("psychiatrist", JSON.stringify(psy));
          }
        } else if (data.psyId) {
          // legacy fallback
          if (remember) localStorage.setItem("psychiatristId", data.psyId);
          else sessionStorage.setItem("psychiatristId", data.psyId);
        }

        localStorage.setItem("role", "psychiatrist");
        alert("Login successful!");
        navigate("/PDashboard");
      } else {
        setError(data.msg || data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
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
        padding: "10px 200px",
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
          maxWidth: "1200px",      // increased from 900 -> 1200
          width: "100%",
          minHeight: "650px",      // increased from 500 -> 650
          height: "auto",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            background: "#b3b7f0",
            color: "#fff",
            flex: 1.05,             // increased flex to give balanced left/right space
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
              maxWidth: "300px",
              minHeight: "80px",
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
              width: "520px",        // increased image size to match larger card
              maxWidth: "95%",
              alignSelf: "flex-end",
              borderRadius: "50%",
              transform: "translateX(50%)",
              objectFit: "cover",
            }}
          />
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            flex: 1.4,             // increased to give more form room
            padding: "48px",      // slightly more padding for spacious layout
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

          <form style={{ display: "flex", flexDirection: "column", gap: "15px" }} onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ ...inputStyle, flex: 1 }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ padding: "6px 10px", fontSize: "12px", cursor: "pointer", borderRadius: "6px", border: "1px solid #ccc", background: "#f5f5f5" }}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me
            </label>

            {error && <div style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>{error}</div>}

            <button type="submit" disabled={loading} style={{ ...buttonStyle, background: "#6366f1" }} onMouseEnter={(e) => (e.target.style.background = "#4f46e5")} onMouseLeave={(e) => (e.target.style.background = "#6366f1")}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div style={{ width: "100%", textAlign: "center", marginTop: 8 }}>
              <span style={{ color: "#888", fontSize: 13 }}>Or sign in with</span>
              <div style={{ marginTop: 8 }}>
                <button type="button" onClick={handleGoogle} style={{ border: "1px solid #e7e7e7", background: "#fff", padding: "8px 12px", borderRadius: 20, display: "inline-flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
                  <svg width="18" height="18" viewBox="0 0 533.5 544.3">
                    <path fill="#4285F4" d="M533.5 278.4c0-17.8-1.6-35.4-4.8-52.4H272v99.6h147.2c-6.4 34.8-26.4 64.2-56.3 83.7v69.6h90.9c53.2-49 83.7-121.2 83.7-200.5z" />
                    <path fill="#34A853" d="M272 544.3c74.8 0 137.6-24.9 183.5-67.6l-90.9-69.6c-25.3 17-57.7 27-92.6 27-71 0-131.2-47.9-152.8-112.6H23.8v70.8C69.6 480.6 163.2 544.3 272 544.3z" />
                    <path fill="#FBBC05" d="M119.2 325.8c-8.9-26.4-8.9-54.6 0-81l-95.4-70.8C3.5 217.7 0 244.9 0 272c0 27.1 3.5 54.3 23.8 97.9l95.4-70.1z" />
                    <path fill="#EA4335" d="M272 107.7c39.8 0 75.7 14 104 40.9l78-78C405.3 19.9 346.2 0 272 0 163.2 0 69.6 63.7 23.8 160.5l95.4 70.8C140.8 155.6 201 107.7 272 107.7z" />
                  </svg>
                  <span style={{ fontWeight: 600 }}>Sign in with Google</span>
                </button>
              </div>
            </div>

            <p style={{ color: "#555", textAlign: "center", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </p>

            <p style={{ marginTop: "12px", color: "#6366f1", cursor: "pointer", fontSize: "14px", textAlign: "center" }} onClick={() => navigate("/")}>
              Not a psychiatrist?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  background: "#fff",
  color: "#000",
  fontSize: "14px",
};

const buttonStyle = {
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  marginTop: "10px",
  color: "#fff",
  fontWeight: "bold",
  transition: "0.3s",
};
