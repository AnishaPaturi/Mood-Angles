import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserWrapper from "../components/UserWrapper";
import {
  Bell,
  User,
  Moon,
  Lock,
  HelpCircle,
  LogOut,
  Star,
  Upload,
  Activity,
  Award,
} from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  // 🌸 States
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("moodangels_settings"))?.darkMode || false
  );
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [quoteReminders, setQuoteReminders] = useState(true);
  const [enableMoodTracking, setEnableMoodTracking] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  // 📊 Dynamic activity data
  const [activityData, setActivityData] = useState({
    timeSpent: "15 mins today",
    testsTaken: 3,
    moodLogs: 2,
    streak: 5,
  });

  const [achievements, setAchievements] = useState(
    JSON.parse(localStorage.getItem("moodangels_achievements")) || {
      mindful: false,
      calm: false,
      empath: false,
    }
  );

  // 🌿 Load other settings from localStorage (if present)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("moodangels_settings"));
    if (saved) {
      setNotifications(saved.notifications ?? notifications);
      setEmailUpdates(saved.emailUpdates ?? emailUpdates);
      setPrivateAccount(saved.privateAccount ?? privateAccount);
      setDailyReminders(saved.dailyReminders ?? dailyReminders);
      setQuoteReminders(saved.quoteReminders ?? quoteReminders);
      setEnableMoodTracking(saved.enableMoodTracking ?? enableMoodTracking);
      // darkMode already initialized from localStorage above
    }
  }, []); // run once

  // Save settings whenever they change
  useEffect(() => {
    const settings = {
      darkMode,
      notifications,
      emailUpdates,
      privateAccount,
      dailyReminders,
      quoteReminders,
      enableMoodTracking,
    };
    localStorage.setItem("moodangels_settings", JSON.stringify(settings));
  }, [
    darkMode,
    notifications,
    emailUpdates,
    privateAccount,
    dailyReminders,
    quoteReminders,
    enableMoodTracking,
  ]);

  // 🌙 Global Dark Mode class on <body>
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [darkMode]);

  // 🏅 Auto-unlock Achievements
  useEffect(() => {
    const ach = { ...achievements };
    if (activityData.testsTaken >= 3) ach.mindful = true;
    if (activityData.streak >= 5) ach.calm = true;
    if (feedback.trim().length > 0) ach.empath = true;
    setAchievements(ach);
    localStorage.setItem("moodangels_achievements", JSON.stringify(ach));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityData, feedback]);

  // 📸 Profile Upload
  const handleUpload = () => fileRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
        localStorage.setItem("profileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 💬 Feedback
  const handleFeedback = () => {
    if (!feedback.trim()) return alert("Please share your feedback first 💬");
    alert("Thank you for sharing your thoughts 🌸");
    setFeedback("");
    setRating(0);
  };

  // 🚪 Logout
  const handleLogout = () => {
    // If you want to keep some localStorage items (like settings), consider clearing selective keys instead.
    localStorage.clear();
    navigate("/");
  };

  return (
    <UserWrapper>
      <div className="settings-container">
        <style>{`
          /* ---------- Base / Light Theme ---------- */
          .settings-container {
            font-family: 'Poppins', sans-serif;
            color: #2d2d2d;
            width: 100%;
            min-height: 100vh;
            padding: 60px 0;
            background: linear-gradient(120deg, #f5d0fe, #dbeafe, #fde4ec);
            display: flex;
            justify-content: center;
            transition: background 0.4s ease, color 0.4s ease;
          }
          .settings-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(18px);
            box-shadow: 0 15px 45px rgba(0, 0, 0, 0.1);
            border-radius: 30px;
            width: 90%;
            max-width: 1100px;
            padding: 50px 70px;
            display: flex;
            flex-direction: column;
            gap: 60px;
            transition: background 0.4s ease, color 0.4s ease;
          }
          .section {
            background: rgba(255, 255, 255, 0.9);
            padding: 35px;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            transition: background 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
          }
          .section h2 {
            font-size: 1.7rem;
            color: #5b21b6;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fafafa;
            padding: 14px 18px;
            border-radius: 14px;
            margin-bottom: 14px;
            transition: background 0.3s;
          }
          .toggle:hover { background: #f3e8ff; }
          .switch {
            width: 48px;
            height: 26px;
            background: #ddd;
            border-radius: 50px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;
          }
          .switch::after {
            content: "";
            position: absolute;
            top: 3px;
            left: 3px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            transition: all 0.3s ease;
          }
          .switch.active { background: linear-gradient(90deg, #a855f7, #ec4899); }
          .switch.active::after { left: 25px; }
          textarea {
            width: 100%;
            border-radius: 10px;
            border: 1px solid #ddd;
            padding: 12px;
            resize: none;
            font-size: 1rem;
            transition: background 0.3s, border-color 0.3s, color 0.3s;
          }
          .rating { display: flex; gap: 10px; margin: 15px 0; }
          .star { font-size: 1.8rem; cursor: pointer; color: #ccc; transition: 0.3s; }
          .star.active { color: #facc15; transform: scale(1.2); }
          .save-btn {
            background: linear-gradient(90deg, #a855f7, #ec4899);
            color: white; border: none; border-radius: 12px;
            padding: 14px 28px; font-weight: 600; font-size: 1rem;
            cursor: pointer; margin-top: 15px;
            transition: transform 0.2s, box-shadow 0.2s;
            align-self: flex-start;
          }
          .save-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(168, 85, 247, 0.3); }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; }
          .stat-card {
            background: linear-gradient(120deg, #c084fc, #ec4899);
            color: white; padding: 20px; border-radius: 20px;
            text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            font-weight: 600;
          }
          .achievement {
            display: flex; gap: 15px; align-items: center;
            background: #f5f3ff; padding: 12px 16px;
            border-radius: 16px; margin-bottom: 12px;
          }
          .achievement span { font-weight: 600; color: #4c1d95; }
          .footer {
            text-align: center; color: #6b6b76;
            font-size: 0.9rem; margin-top: 10px;
          }

          /* ---------- DARK MODE OVERRIDES ---------- */
          body.dark-mode {
            background: linear-gradient(120deg, #071226, #1a1632, #2b0449);
            color: #e6eef8;
          }

          body.dark-mode .settings-card {
            background: rgba(15, 23, 42, 0.8);
            color: #e6eef8;
          }

          body.dark-mode .section {
            background: rgba(20, 26, 39, 0.85);
            color: #dbeafe;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }

          body.dark-mode .section h2 {
            color: #c4b5fd;
          }

          body.dark-mode .toggle {
            background: rgba(39, 49, 66, 0.6);
          }

          body.dark-mode .toggle:hover {
            background: rgba(58, 68, 90, 0.65);
          }

          body.dark-mode .switch {
            background: #475569;
          }

          body.dark-mode .switch.active {
            background: linear-gradient(90deg, #8b5cf6, #ec4899);
          }

          body.dark-mode textarea {
            background: #0b1220;
            border-color: #374151;
            color: #e6eef8;
          }

          body.dark-mode .stat-card {
            background: linear-gradient(120deg, #6d28d9, #be185d);
            color: white;
          }

          body.dark-mode .achievement {
            background: rgba(76, 29, 149, 0.18);
            color: #f3e8ff;
          }

          body.dark-mode .footer {
            color: #94a3b8;
          }

          /* small responsive tweaks */
          @media (max-width: 720px) {
            .settings-card { padding: 30px 20px; }
            .section { padding: 20px; }
            .section h2 { font-size: 1.3rem; }
          }
        `}</style>

        <div className="settings-card">
          {/* HEADER */}
          <div
            className="section"
            style={{
              textAlign: "center",
              background: "linear-gradient(120deg,#c084fc,#ec4899)",
              color: "white",
            }}
          >
            <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
              Personalize Your Journey 🌷
            </h1>
            <p>
              Adjust your MoodAngels experience — your comfort, your peace, your
              control 🌿
            </p>
          </div>

          {/* WELLNESS */}
          <div className="section">
            <h2>🧘 Wellness Preferences</h2>

            <div className="toggle">
              <span>Show Daily Motivation Quotes</span>
              <div
                className={`switch ${quoteReminders ? "active" : ""}`}
                onClick={() => setQuoteReminders(!quoteReminders)}
                role="button"
                aria-pressed={quoteReminders}
              />
            </div>

            <div className="toggle">
              <span>Enable Mood Tracking</span>
              <div
                className={`switch ${enableMoodTracking ? "active" : ""}`}
                onClick={() => setEnableMoodTracking(!enableMoodTracking)}
                role="button"
                aria-pressed={enableMoodTracking}
              />
            </div>
          </div>

          {/* APPEARANCE */}
          <div className="section">
            <h2><Moon size={22} /> Appearance</h2>
            <div className="toggle">
              <span>Dark Mode</span>
              <div
                className={`switch ${darkMode ? "active" : ""}`}
                onClick={() => setDarkMode(!darkMode)}
                role="button"
                aria-pressed={darkMode}
              />
            </div>
          </div>

          {/* PRIVACY */}
          <div className="section">
            <h2><Lock size={22} /> Privacy & Security</h2>

            <div className="toggle">
              <span>Private Account</span>
              <div
                className={`switch ${privateAccount ? "active" : ""}`}
                onClick={() => setPrivateAccount(!privateAccount)}
                role="button"
                aria-pressed={privateAccount}
              />
            </div>

            <div className="toggle">
              <span>Two-Step Verification</span>
              <div
                className={`switch`}
                onClick={() => alert("Two-step verification is coming soon 🔒")}
                role="button"
                aria-pressed={false}
              />
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="section">
            <h2><Activity size={22} /> Your Activity Overview</h2>
            <div className="stats">
              <div className="stat-card">⏰ {activityData.timeSpent}</div>
              <div className="stat-card">🧠 Tests Taken: {activityData.testsTaken}</div>
              <div className="stat-card">🌿 Mood Logs: {activityData.moodLogs}</div>
              <div className="stat-card">🔥 Streak: {activityData.streak} days</div>
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div className="section">
            <h2><Award size={22} /> Your Achievements</h2>
            {achievements.mindful && <div className="achievement">🌞 <span>Mindful Starter</span> — Completed 3 tests</div>}
            {achievements.calm && <div className="achievement">🧘 <span>Calm Soul</span> — Logged in 1 day in a row</div>}
            {achievements.empath && <div className="achievement">💖 <span>Empath Angel</span> — Shared feedback</div>}
            {!achievements.mindful && !achievements.calm && !achievements.empath && (
              <p style={{ color: "#7c3aed", fontWeight: 600 }}>No achievements yet — keep going! 🌱</p>
            )}
          </div>

          {/* FEEDBACK */}
          <div className="section">
            <h2><HelpCircle size={22} /> Feedback & Support</h2>
            <textarea
              placeholder="Share your thoughts — we’re always listening 💬"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
            />
            <div className="rating">
              {[1, 2, 3, 4, 5].map((num) => (
                <Star
                  key={num}
                  className={`star ${rating >= num ? "active" : ""}`}
                  onClick={() => setRating(num)}
                />
              ))}
            </div>
            <button className="save-btn" onClick={handleFeedback}>
              Send Feedback
            </button>
          </div>

          {/* UPLOAD (hidden input + trigger example) */}
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {/* If you want a visible trigger: */}
          {/* <button onClick={handleUpload} className="save-btn">Upload Profile Image</button> */}

          {/* LOGOUT */}
          <div className="section" style={{ textAlign: "center" }}>
            <h2><LogOut size={22} /> Account</h2>
            <p>Take a break or log out safely. You’re always welcome back 🌸</p>
            <button
              className="save-btn"
              style={{ background: "#ef4444" }}
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>

          <div className="footer">
            Version 1.4.0 • © 2025 MoodAngels • Crafted with 💜 for your well-being
          </div>
        </div>
      </div>
    </UserWrapper>
  );
}
