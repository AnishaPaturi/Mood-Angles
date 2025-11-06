import { getActivity } from "../utils/activityTracker"; // ✅ pulls live data

import React, { useState, useEffect, useRef } from "react";
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
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  // 🌸 States
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [quoteReminders, setQuoteReminders] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  // 📊 Dynamic data
  const [activityData, setActivityData] = useState({
    timeSpent: "0 mins today",
    testsTaken: 0,
    moodLogs: 0,
    streak: 0,
  });

  const [achievements, setAchievements] = useState(
    JSON.parse(localStorage.getItem("moodangels_achievements")) || {
      mindful: false,
      calm: false,
      empath: false,
    }
  );

  // 🌿 Load + Save Settings
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("moodangels_settings"));
    if (saved) {
      setDarkMode(saved.darkMode);
      setNotifications(saved.notifications);
      setEmailUpdates(saved.emailUpdates);
      setPrivateAccount(saved.privateAccount);
      setDailyReminders(saved.dailyReminders);
      setQuoteReminders(saved.quoteReminders);
    }
  }, []);

  useEffect(() => {
    const settings = {
      darkMode,
      notifications,
      emailUpdates,
      privateAccount,
      dailyReminders,
      quoteReminders,
    };
    localStorage.setItem("moodangels_settings", JSON.stringify(settings));
  }, [
    darkMode,
    notifications,
    emailUpdates,
    privateAccount,
    dailyReminders,
    quoteReminders,
  ]);

  // 🌙 Global Dark Mode
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [darkMode]);

  // ✅ Realtime Activity (live from localStorage)
  useEffect(() => {
    const updateStats = () => {
      const stats = getActivity();
      if (stats) {
        setActivityData({
          timeSpent: `${stats.sessionTime || 0} mins today`,
          testsTaken: stats.testsTaken || 0,
          moodLogs: stats.moodLogs || 0,
          streak: stats.streak || 0,
        });
      }
    };

    // run immediately and every 10 seconds
    updateStats();
    const interval = setInterval(updateStats, 10000);

    return () => clearInterval(interval);
  }, []);

  // 🏅 Auto-unlock Achievements
  useEffect(() => {
    const ach = { ...achievements };
    if (activityData.testsTaken >= 3) ach.mindful = true;
    if (activityData.streak >= 5) ach.calm = true;
    if (feedback.trim().length > 0) ach.empath = true;
    setAchievements(ach);
    localStorage.setItem("moodangels_achievements", JSON.stringify(ach));
  }, [activityData, feedback]);

  // 📸 Profile Upload
  const handleUpload = () => fileRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
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
    localStorage.clear();
    navigate("/");
  };

  return (
    <UserWrapper>
      <div className="settings-container">
        <style>{`
          .settings-container {
            font-family: 'Poppins', sans-serif;
            color: #2d2d2d;
            width: 100%;
            min-height: 100vh;
            padding: 60px 0;
            background: linear-gradient(120deg, #f5d0fe, #dbeafe, #fde4ec);
            display: flex;
            justify-content: center;
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
          }

          .section {
            background: rgba(255, 255, 255, 0.9);
            padding: 35px;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
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
          .profile-preview { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #a855f7; }

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
            {[
              ["Show Daily Motivation Quotes", quoteReminders, setQuoteReminders],
              ["Enable Mood Tracking", true, () => {}],
            ].map(([label, state, setState]) => (
              <div key={label} className="toggle">
                <span>{label}</span>
                <div
                  className={`switch ${state ? "active" : ""}`}
                  onClick={() => setState(!state)}
                ></div>
              </div>
            ))}
          </div>

          {/* APPEARANCE */}
          <div className="section">
            <h2>
              <Moon size={22} /> Appearance
            </h2>
            <div className="toggle">
              <span>Dark Mode</span>
              <div
                className={`switch ${darkMode ? "active" : ""}`}
                onClick={() => setDarkMode(!darkMode)}
              ></div>
            </div>
          </div>

          {/* PRIVACY */}
          <div className="section">
            <h2>
              <Lock size={22} /> Privacy & Security
            </h2>
            {[
              ["Private Account", privateAccount, setPrivateAccount],
              ["Two-Step Verification", false, () => alert("Coming soon 🔒")],
            ].map(([label, state, setState]) => (
              <div key={label} className="toggle">
                <span>{label}</span>
                <div
                  className={`switch ${state ? "active" : ""}`}
                  onClick={() => setState(!state)}
                ></div>
              </div>
            ))}
          </div>

          {/* ACTIVITY */}
          <div className="section">
            <h2>
              <Activity size={22} /> Your Activity Overview
            </h2>
            <div className="stats">
              <div className="stat-card">⏰ {activityData.timeSpent}</div>
              <div className="stat-card">🧠 Tests Taken: {activityData.testsTaken}</div>
              <div className="stat-card">🌿 Mood Logs: {activityData.moodLogs}</div>
              <div className="stat-card">🔥 Streak: {activityData.streak} days</div>
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div className="section">
            <h2>
              <Award size={22} /> Your Achievements
            </h2>
            {achievements.mindful && (
              <div className="achievement">🌞 <span>Mindful Starter</span> — Completed 3 tests</div>
            )}
            {achievements.calm && (
              <div className="achievement">🧘 <span>Calm Soul</span> — Logged in 5 days in a row</div>
            )}
            {achievements.empath && (
              <div className="achievement">💖 <span>Empath Angel</span> — Shared feedback</div>
            )}
          </div>

          {/* APP USAGE */}
          <div className="section">
            <h2>
              <Activity size={22} /> App Usage Summary
            </h2>
            <p>📅 Active Days: <b>23</b></p>
            <p>🕒 Total Focus Time: <b>7h 41m</b></p>
            <p>💬 Last Mood Log: <b>3 hours ago</b></p>
          </div>

          {/* FEEDBACK */}
          <div className="section">
            <h2>
              <HelpCircle size={22} /> Feedback & Support
            </h2>
            <textarea
              placeholder="Share your thoughts — we’re always listening 💬"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
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

          {/* LOGOUT */}
          <div className="section" style={{ textAlign: "center" }}>
            <h2>
              <LogOut size={22} /> Account
            </h2>
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
