// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import stethoscope from "../assets/stethoscope.png";

// export default function PsychiatristSignup() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//     age: "",
//     experience: "",
//     qualification: "",
//   });

//   const [error, setError] = useState("");
//   const [animatedText, setAnimatedText] = useState("");
//   const navigate = useNavigate();

//   const fullText =
//     "At MoodAngles, we’re always focused on helping you heal minds and change lives.";

//   // ✨ Animated text
//   useEffect(() => {
//     let index = 0;
//     const interval = setInterval(() => {
//       if (index < fullText.length) {
//         setAnimatedText((prev) => prev + fullText.charAt(index));
//         index++;
//       } else clearInterval(interval);
//     }, 40);
//     return () => clearInterval(interval);
//   }, []);

//   // ✏️ Input change handler
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Submit handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // Validation
//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }
//     if (formData.age < 25) {
//       setError("Psychiatrists must be at least 25 years old.");
//       return;
//     }

//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/auth/psychiatrist/signup",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         }
//       );

//       const data = await res.json();

//       if (res.ok) {
//         alert("Signup successful! Please log in.");
//         navigate("/PLogin");
//       } else {
//         setError(data.msg || data.error || "Signup failed. Try again.");
//       }
//     } catch (err) {
//       console.error("Signup error:", err);
//       setError("Server error. Please try again later.");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         {/* LEFT SIDE */}
//         <div style={styles.left}>
//           <p style={styles.animatedText}>{animatedText}</p>
//           <img src={stethoscope} alt="stethoscope" style={styles.image} />
//         </div>

//         {/* RIGHT SIDE */}
//         <div style={styles.right}>
//           <div style={styles.tabRow}>
//             <button
//               style={{ ...styles.tab, ...styles.activeTab }}
//               onClick={() => navigate("/PSignup")}
//             >
//               Sign Up
//             </button>
//             <button style={styles.tab} onClick={() => navigate("/PLogin")}>
//               Login
//             </button>
//           </div>

//           <h2 style={styles.heading}>Create Psychiatrist Account</h2>

//           <form style={styles.form} onSubmit={handleSubmit} noValidate>
//             <input
//               type="text"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleChange}
//               required
//               style={styles.input}
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               style={styles.input}
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               style={styles.input}
//             />
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               style={styles.input}
//             />
//             <input
//               type="tel"
//               name="phone"
//               placeholder="Phone Number"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               style={styles.input}
//             />
//             <input
//               type="number"
//               name="age"
//               placeholder="Age"
//               value={formData.age}
//               onChange={handleChange}
//               min="25"
//               required
//               style={styles.input}
//             />
//             <input
//               type="number"
//               name="experience"
//               placeholder="Experience (in years)"
//               value={formData.experience}
//               onChange={handleChange}
//               min="0"
//               required
//               style={styles.input}
//             />

//             <label style={styles.label}>Select Qualification:</label>
//             <select
//               name="qualification"
//               value={formData.qualification}
//               onChange={handleChange}
//               required
//               style={styles.select}
//             >
//               <option value="" disabled>
//                 -- Choose qualification --
//               </option>
//               <option value="mbbs-md-psychiatry">MBBS + MD (Psychiatry)</option>
//               <option value="mbbs-dpm">MBBS + DPM</option>
//               <option value="mbbs-dnb-psychiatry">
//                 MBBS + DNB (Psychiatry)
//               </option>
//               <option value="do-psychiatry">DO Psychiatry</option>
//               <option value="board-psychiatrist">
//                 Board-certified Psychiatrist
//               </option>
//               <option value="mphil-clinical-psychology">
//                 M.Phil in Clinical Psychology
//               </option>
//               <option value="phd-clinical-psychology">
//                 PhD in Clinical Psychology
//               </option>
//               <option value="psyd">PsyD (Doctor of Psychology)</option>
//               <option value="ma-msc-psychology">
//                 MA/MSc in Psychology
//               </option>
//               <option value="mphil-counseling-psychology">
//                 M.Phil in Counseling Psychology
//               </option>
//             </select>

//             {error && <div style={styles.error}>{error}</div>}

//             <button type="submit" style={styles.submit}>
//               Create Account
//             </button>

//             <p
//               style={styles.switchText}
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

// // 🎨 Styles
// const styles = {
//   container: {
//     minHeight: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "#eceff6",
//     padding: "30px 200px",
//     fontFamily: "Poppins, system-ui",
//   },
//   card: {
//     display: "flex",
//     flexDirection: "row",
//     width: "90%",
//     maxWidth: "1100px",
//     minHeight: "500px",
//     borderRadius: "12px",
//     overflow: "hidden",
//     background: "#fff",
//     boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
//   },
//   left: {
//     background: "#b3b7f0",
//     flex: 0.9,
//     padding: "40px",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     textAlign: "center",
//   },
//   animatedText: {
//     color: "#000",
//     fontSize: "18px",
//     fontWeight: "bold",
//     lineHeight: 1.5,
//     maxWidth: "250px",
//     minHeight: "60px",
//     whiteSpace: "pre-wrap",
//   },
//   image: {
//     marginTop: "24px",
//     width: "400px",
//     maxWidth: "90%",
//     borderRadius: "50%",
//     transform: "translateX(50%)",
//     objectFit: "cover",
//   },
//   right: {
//     flex: 1.5,
//     padding: "40px 60px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     background: "#fff",
//     overflowY: "auto",
//   },
//   tabRow: {
//     display: "flex",
//     justifyContent: "center",
//     marginBottom: "20px",
//     gap: "10px",
//   },
//   tab: {
//     padding: "8px 20px",
//     borderRadius: "20px",
//     border: "1px solid #ccc",
//     backgroundColor: "#fff",
//     color: "#000",
//     cursor: "pointer",
//     fontWeight: "500",
//     fontSize: "14px",
//   },
//   activeTab: {
//     backgroundColor: "#b3b7f0",
//     border: "1px solid #b3b7f0",
//     color: "#fff",
//   },
//   heading: {
//     marginBottom: "20px",
//     fontSize: "24px",
//     fontWeight: "600",
//     color: "#000",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "14px",
//     width: "100%",
//     maxWidth: "500px",
//   },
//   input: {
//     padding: "12px",
//     fontSize: "14px",
//     border: "1px solid #ddd",
//     borderRadius: "8px",
//     outline: "none",
//     backgroundColor: "#fff",
//     color: "#000",
//   },
//   select: {
//     padding: "12px",
//     borderRadius: "8px",
//     border: "1px solid #ddd",
//     fontSize: "14px",
//     background: "#fff",
//     color: "#000",
//   },
//   label: {
//     fontSize: "14px",
//     fontWeight: "500",
//     color: "#000",
//   },
//   error: {
//     color: "#b12b2b",
//     background: "#feecec",
//     padding: "10px",
//     borderRadius: "6px",
//     textAlign: "center",
//     fontSize: "14px",
//   },
//   submit: {
//     background: "#6e8efb",
//     color: "#fff",
//     padding: "14px",
//     border: "none",
//     borderRadius: "8px",
//     fontWeight: "bold",
//     cursor: "pointer",
//     fontSize: "16px",
//   },
//   switchText: {
//     marginTop: "12px",
//     color: "#6e8efb",
//     cursor: "pointer",
//     fontSize: "14px",
//     textAlign: "center",
//   },
// };


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
    terms: false,
  });

  const [error, setError] = useState("");
  const [animatedText, setAnimatedText] = useState("");
  const navigate = useNavigate();

  const fullText =
    "   At MoodAngles, we’re always focused on helping you heal minds and change lives.";

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

  // Password rule: 8+ chars, 1 uppercase, 1 digit, 1 special (@#$ _)
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$_])[A-Za-z\d@#$_]{8,}$/;

  // ✏️ Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Google OAuth redirect (reuses backend endpoint)
  const handleGoogle = () => {
    // same pattern as user signup (backend should handle)
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validations copied from user signup + psychiatrist specific checks
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 chars, include 1 uppercase, 1 digit & 1 special char (@ # $ _)"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.terms) {
      setError("Please agree to Terms & Conditions");
      return;
    }

    if (Number(formData.age) < 25) {
      setError("Psychiatrists must be at least 25 years old.");
      return;
    }

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        experience: Number(formData.experience),
      };

      const res = await fetch(
        "http://localhost:5000/api/auth/psychiatrist/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Please log in.");
        navigate("/PLogin");
      } else {
        setError(data.msg || data.error || data.message || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      // fallback for local UI testing (keeps experience consistent with user page)
      // If you don't want fallback navigation, simply remove the next line.
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
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ ...styles.input, flex: 1 }}
              />
              <div
                title={
                  "Password rules: min 8 chars, 1 uppercase, 1 digit, 1 special (@ # $ _)"
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid #eee",
                  background: "#fafafa",
                  fontSize: 16,
                }}
              >
                ⓘ
              </div>
            </div>

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

            <label style={{ ...styles.label, display: "block", marginTop: 8 }}>
              Select Qualification:
            </label>
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
              <option value="mbbs-dnb-psychiatry">MBBS + DNB (Psychiatry)</option>
              <option value="do-psychiatry">DO Psychiatry</option>
              <option value="board-psychiatrist">Board-certified Psychiatrist</option>
              <option value="mphil-clinical-psychology">M.Phil in Clinical Psychology</option>
              <option value="phd-clinical-psychology">PhD in Clinical Psychology</option>
              <option value="psyd">PsyD (Doctor of Psychology)</option>
              <option value="ma-msc-psychology">MA/MSc in Psychology</option>
              <option value="mphil-counseling-psychology">M.Phil in Counseling Psychology</option>
            </select>

            <label style={{ fontSize: "13px", color: "#555", marginTop: 6 }}>
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />{" "}
              I agree to the Terms & Conditions
            </label>

            {error && <div style={styles.error}>{error}</div>}

            <button type="submit" style={styles.submit}>
              Create Account
            </button>

            <div style={{ width: "100%", textAlign: "center", marginTop: 8 }}>
              <span style={{ color: "#888", fontSize: 13 }}>Or sign up with</span>
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  onClick={handleGoogle}
                  style={{
                    border: "1px solid #e7e7e7",
                    background: "#fff",
                    padding: "8px 12px",
                    borderRadius: 20,
                    display: "inline-flex",
                    gap: 8,
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 533.5 544.3">
                    <path fill="#4285F4" d="M533.5 278.4c0-17.8-1.6-35.4-4.8-52.4H272v99.6h147.2c-6.4 34.8-26.4 64.2-56.3 83.7v69.6h90.9c53.2-49 83.7-121.2 83.7-200.5z" />
                    <path fill="#34A853" d="M272 544.3c74.8 0 137.6-24.9 183.5-67.6l-90.9-69.6c-25.3 17-57.7 27-92.6 27-71 0-131.2-47.9-152.8-112.6H23.8v70.8C69.6 480.6 163.2 544.3 272 544.3z" />
                    <path fill="#FBBC05" d="M119.2 325.8c-8.9-26.4-8.9-54.6 0-81l-95.4-70.8C3.5 217.7 0 244.9 0 272c0 27.1 3.5 54.3 23.8 97.9l95.4-70.1z" />
                    <path fill="#EA4335" d="M272 107.7c39.8 0 75.7 14 104 40.9l78-78C405.3 19.9 346.2 0 272 0 163.2 0 69.6 63.7 23.8 160.5l95.4 70.8C140.8 155.6 201 107.7 272 107.7z" />
                  </svg>
                  <span style={{ fontWeight: 600 }}>Sign up with Google</span>
                </button>
              </div>
            </div>

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

// 🎨 Styles (kept exactly as original; only JS logic changed)
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
