// src/pages/Help.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import UserWrapper from "../components/UserWrapper";
import { ChevronDown, ChevronUp, MessageCircle, X } from "lucide-react";

export default function Help() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesRef = useRef(null);

  const quickOptions = [
    "How to take a mood test?",
    "View my results",
    "Login / Password help",
    "Find a doctor / psychologist",
  ];

  const faqs = [
    {
      q: "How do I take a mood test?",
      a: (
        <>
          Go to <Link to="/test" className="faq-link">Mood Test</Link> in your Dashboard, select a test, and follow the instructions.
        </>
      ),
    },
    {
      q: "How can I understand my results?",
      a: (
        <>
          You can view and understand your results directly on the <Link to="/test" className="faq-link">Results</Link>. They appear right at the bottom after you complete the test.
        </>
      ),
    },
    {
      q: "How do I contact a professional?",
      a: (
        <>
          Visit <Link to="/TherapistF" className="faq-link">Find a Therapist</Link> to message or schedule appointments with certified professionals.
        </>
      ),
    },
    {
      q: "How do I manage my profile and settings?",
      a: (
        <>
          Update your info at <Link to="/Profile" className="faq-link">Dashboard → Profile</Link> for preferences and privacy settings.
        </>
      ),
    },
  ];

  useEffect(() => resetChat(), []);
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);
  const resetChat = () => {
    setMessages([
      { sender: "bot", text: "👋 Hi! I'm Angel, your MoodAngels helper. How can I assist you today?" },
    ]);
    setInput("");
    setTyping(false);
  };

  const handleUserMessage = (msg) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = computeReply(msg);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setTyping(false);
    }, 700);
  };

  const handleOptionClick = (option) => handleUserMessage(option);

  const computeReply = (text) => {
    const t = text.toLowerCase();
    if (/(hi|hello|hey|how are you)/.test(t)) {
      return "Hey! 😊 I can help with tests, results, profile, login, or contacting professionals. What would you like to know?";
    }
    if (t.includes("mood test") || t.includes("take a test") || t.includes("test")) {
      return <>🧠 Take a test via <Link to="/test" className="faq-link">Mood Test</Link> in your Dashboard.</>;
    }
    if (t.includes("result") || t.includes("score")) {
      return <>📊 View your results at <Link to="/Dashboard" className="faq-link">Dashboard → Results</Link>.</>;
    }
    if (t.includes("doctor") || t.includes("psychologist") || t.includes("professional") || t.includes("contact")) {
      return <>💬 Reach professionals via <Link to="/Therapist" className="faq-link">Contact</Link>.</>;
    }
    if (t.includes("profile") || t.includes("settings") || t.includes("account")) {
      return <>⚙️ Update your profile at <Link to="/Profile" className="faq-link">Profile</Link>.</>;
    }
    if (t.includes("login") || t.includes("password") || t.includes("username")) {
      return <>🔑 For login issues, reset your password on the <Link to="/forgot-password" className="faq-link">Forgot Password</Link> page or check your username/email.</>;
    }
    return "❌ Sorry, I can only help with MoodAngels website-related questions.";
  };

  const css = `
  .help-section {
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:3rem;
    padding:4rem 1rem 6rem;
    background: linear-gradient(to bottom right, #fff0f5, #f0faff, #fef6ff);
    min-height:100vh;
  }

  .info-cards {
    display:flex;
    flex-direction:column;
    gap:3.5rem;
    align-items:center;
    width:100%;
  }

  .info-card {
    width:95%;
    max-width:1500px;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(25px);
    border-radius:3rem;
    padding:4rem 5rem;
    box-shadow:0 25px 90px rgba(126,34,206,0.15);
    border:1px solid rgba(255,255,255,0.3);
    position:relative;
    overflow:hidden;
    transition: all 0.4s ease;
  }

  .info-card::before {
    content:"";
    position:absolute;
    inset:0;
    background: radial-gradient(circle at 20% 20%, rgba(255,192,203,0.3), transparent 60%),
                radial-gradient(circle at 80% 80%, rgba(216,180,254,0.25), transparent 60%);
    z-index:0;
  }

  .info-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 30px 100px rgba(126,34,206,0.25);
  }

  .info-card h2 {
    position:relative;
    z-index:1;
    font-size:2.2rem;
    font-weight:700;
    color:#7e22ce;
    text-shadow:0 2px 10px rgba(126,34,206,0.25);
    margin-bottom:1rem;
  }

  .info-card p {
    position:relative;
    z-index:1;
    color:#4b4b6b;
    line-height:1.6;
    font-size:1.1rem;
    margin-bottom:2rem;
  }

  .express-grid, .calm-grid, .kindness-grid, .safety-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 2.2rem;
    position: relative;
    z-index: 1;
  }

  .express-item, .calm-item, .kind-item, .safe-item {
    background: rgba(255,255,255,0.98);
    border-radius: 1.8rem;
    padding: 2rem 2.4rem;
    display: flex;
    align-items: flex-start;
    gap: 1.4rem;
    box-shadow: 0 12px 35px rgba(255, 182, 193, 0.25);
    transition: all 0.3s ease;
  }

  .express-item:hover, .calm-item:hover, .kind-item:hover, .safe-item:hover {
    transform: translateY(-6px);
    background: linear-gradient(to right, #fff0f5, #faf5ff);
    box-shadow: 0 18px 50px rgba(255, 182, 193, 0.4);
  }

  .emoji {
    font-size:2.4rem;
    flex-shrink:0;
    background: linear-gradient(135deg, #ffb6c1, #d8b4fe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .info-card h3 {
    color:#5b21b6;
    font-size:1.2rem;
    font-weight:600;
    margin-bottom:0.4rem;
  }

  /* Help & FAQs */
  .help-card {
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(20px);
    border-radius: 2.5rem;
    padding: 3rem 4rem;
    width:95%;
    max-width:1500px;
    box-shadow: 0 25px 80px rgba(126,34,206,0.15);
    border: 1px solid rgba(240,230,255,0.6);
    position: relative;
    overflow: hidden;
  }

  .help-card::before {
    content:"";
    position:absolute;
    inset:0;
    background: radial-gradient(circle at top left, rgba(255,182,193,0.25), transparent 70%),
                radial-gradient(circle at bottom right, rgba(216,180,254,0.25), transparent 70%);
    z-index:0;
  }

  .help-card h1 {
    text-align:center;
    font-size:2.4rem;
    font-weight:700;
    color:#6b21a8;
    margin-bottom:1rem;
    position:relative;
    z-index:1;
  }

  .help-card p.intro {
    text-align:center;
    color:#555;
    margin-bottom:2rem;
    position:relative;
    z-index:1;
  }

  .faq-item {
    background:white;
    border-radius:1.5rem;
    margin-bottom:1rem;
    padding:1.2rem 1.6rem;
    box-shadow:0 10px 30px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    position:relative;
    z-index:1;
  }

  .faq-item:hover {
    transform:translateY(-3px);
    box-shadow:0 15px 45px rgba(126,34,206,0.1);
  }

  .faq-question {
    display:flex;
    justify-content:space-between;
    align-items:center;
    font-weight:600;
    color:#5b21b6;
    cursor:pointer;
    font-size:1.1rem;
  }

  .faq-answer {
    max-height:0;
    overflow:hidden;
    opacity:0;
    color:#4c4c6b;
    transition:all 0.4s ease;
    margin-top:0.5rem;
    line-height:1.6;
  }

  .faq-answer.open {
    max-height:200px;
    opacity:1;
    padding-top:0.3rem;
  }

  .faq-link {
    color:#ff69b4;
    text-decoration:underline;
    font-weight:500;
  }

   /* ---------- Chatbot Styles ---------- */
  .chatbot-button {
    position: fixed;
    bottom:30px;
    right:30px;
    background: #ff69b4;
    border-radius:50%;
    width:80px;
    height:80px;
    display:flex;
    justify-content:center;
    align-items:center;
    cursor:pointer;
    box-shadow:0 12px 30px rgba(0,0,0,0.25);
    transition: all 0.3s ease;
    z-index:999;
  }
  .chatbot-button:hover { transform: scale(1.15); }

  .chatbot-window {
    position: fixed;
    bottom:130px;
    right:30px;
    width:450px;
    max-height:600px;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(15px);
    border-radius:2rem;
    box-shadow: 0 25px 70px rgba(0,0,0,0.25);
    display:flex;
    flex-direction:column;
    overflow:hidden;
    font-family:'Arial', sans-serif;
    z-index:998;
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from {opacity:0; transform:translateY(20px);} to {opacity:1; transform:translateY(0);} }

  .chatbot-header {
    background:#ff85c1;
    padding:15px 18px;
    color:white;
    font-weight:bold;
    display:flex;
    justify-content:space-between;
    align-items:center;
    font-size:1.1rem;
    cursor:default;
  }

  .chatbot-messages {
    flex:1;
    padding:15px;
    overflow-y:auto;
    display:flex;
    flex-direction:column;
    gap:10px;
    background: #fff0f5;
  }
  .message {
    padding:12px 18px;
    border-radius:25px;
    max-width:75%;
    line-height:1.5;
    word-wrap:break-word;
    font-size:0.95rem;
    box-shadow:0 5px 15px rgba(0,0,0,0.05);
  }
  .message.bot { background:#ffe6f0; align-self:flex-start; color:#333; }
  .message.user { background:#ffb6c1; align-self:flex-end; color:white; }

  .chatbot-input {
    display:flex;
    border-top:1px solid #ffd1dc;
    padding:12px;
    background:#fff;
  }
  .chatbot-input input {
    flex:1;
    padding:12px 16px;
    border-radius:25px;
    border:1px solid #ffb6c1;
    outline:none;
    font-size:1rem;
  }
  .chatbot-input button {
    margin-left:10px;
    background:#ff69b4;
    border:none;
    padding:12px 18px;
    border-radius:25px;
    color:white;
    font-weight:bold;
    cursor:pointer;
    transition:0.2s;
  }
  .chatbot-input button:hover { transform:scale(1.05); background:#ff1493; }

  .chatbot-quick {
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    margin-top:8px;
    padding:0 12px 12px 12px;
  }
  .chatbot-quick button {
    background:#ffd1dc;
    border:none;
    padding:8px 16px;
    border-radius:25px;
    cursor:pointer;
    font-size:0.9rem;
    transition:0.2s;
  }
  .chatbot-quick button:hover { transform:scale(1.05); background:#ff85c1; color:white; }

  .typing { font-size:0.9rem; color:#555; font-style:italic; padding-left:5px; }
  `;

  return (
    <UserWrapper>
      <div className="help-section">
        <div className="info-cards">
          <div className="info-card">
            <h2>🖋 Express Yourself</h2>
            <p>Give your emotions a voice — through words, art, and creativity that heals the heart. 🌈</p>
            <div className="express-grid">
              <div className="express-item"><span className="emoji">💭</span><div><h3>Mood Journal</h3><p>Write about your feelings freely. Label emotions with emojis — each word brings clarity.</p></div></div>
              <div className="express-item"><span className="emoji">🎙</span><div><h3>Voice Notes</h3><p>Speak your mind — record thoughts and watch your healing voice grow stronger. 🌿</p></div></div>
              <div className="express-item"><span className="emoji">✨</span><div><h3>Emotion Doodles</h3><p>Draw your feelings. Let colors express what words can’t. 🎨</p></div></div>
              <div className="express-item"><span className="emoji">🕊</span><div><h3>Letters You’ll Never Send</h3><p>Write to release. Say the unsaid, feel lighter, and let go. 💌</p></div></div>
              <div className="express-item"><span className="emoji">📖</span><div><h3>Thought Jar</h3><p>Keep short reflections — tiny pieces of your story. 🌻</p></div></div>
              <div className="express-item"><span className="emoji">🌈</span><div><h3>Daily Reflection</h3><p>Reflect with kindness: “What made me smile today?” 🌞</p></div></div>
            </div>
          </div>

          <div className="info-card">
            <h2>🧘 Calm & Relax</h2>
            <p>Find peace in small pauses — breathe, unwind, and let stillness comfort you. 💫</p>
            <div className="calm-grid">
              <div className="calm-item"><span className="emoji">💨</span><div><h3>Breathing Exercises</h3><p>Inhale calm, exhale tension. Let the air remind you — you are safe. 🌬️</p></div></div>
              <div className="calm-item"><span className="emoji">🎶</span><div><h3>Soothing Sounds</h3><p>Soft rain, ocean waves, or piano notes — find your rhythm of calm. 🌊</p></div></div>
              <div className="calm-item"><span className="emoji">🌿</span><div><h3>Mindful Rituals</h3><p>Stretch, light a candle, breathe in lavender — peace lives in details.</p></div></div>
              <div className="calm-item"><span className="emoji">💬</span><div><h3>Daily Affirmations</h3><p>Repeat softly: “I am healing. I am loved. I am enough.” 🌷</p></div></div>
            </div>
          </div>

          <div className="info-card">
            <h2>💖 Community Kindness</h2>
            <p>Healing is lighter together — join, share, and spread warmth where it’s needed most. 🤝</p>
            <div className="kindness-grid">
              <div className="kind-item"><span className="emoji">💬</span><div><h3>Join Us</h3><p>Be part of our safe space at <a href="https://discord.gg/4gKsmdYz" target="_blank" rel="noreferrer" className="faq-link">Discord</a> 💞</p></div></div>
              <div className="kind-item"><span className="emoji">🌸</span><div><h3>Inspire Others</h3><p>Leave notes of hope, love, or humor. You never know who needed it. 🌻</p></div></div>
              <div className="kind-item"><span className="emoji">🕊</span><div><h3>Uplifting Threads</h3><p>Read stories of courage and remind yourself — healing is shared. 💫</p></div></div>
              <div className="kind-item"><span className="emoji">📧</span><div><h3>Email Support</h3><p>Reach us anytime at <a href="https://mail.google.com/mail/?view=cm&fs=1&to=moodangles05@gmail.com" target="_blank" rel="noopener noreferrer" className="faq-link">Email Us</a> moodangles05@gmail.com</p></div></div>

            </div>
          </div>

          <div className="info-card">
            <h2>🛡 Safety Reminder</h2>
            <p>Your safety matters most. You’re not alone — even on the darkest nights. 🌙</p>
            <div className="safety-grid">
              <div className="safe-item"><span className="emoji">🤝</span><div><h3>Reach Out</h3><p>Speak to someone you trust — connection heals. 💕</p></div></div>
              <div className="safe-item"><span className="emoji">📞</span><div><h3>Seek Support</h3><p>Professionals and helplines are here for you — always. 🌻</p></div></div>
              <div className="safe-item"><span className="emoji">💗</span><div><h3>Be Gentle</h3><p>Healing is slow and sacred. Rest when you need to. 🌸</p></div></div>
              <div className="safe-item"><span className="emoji">🌙</span><div><h3>Small Steps</h3><p>Each tiny step forward is courage in motion. 🌼</p></div></div>
            </div>
          </div>
        </div>

        {/* Help & FAQs */}
        <div className="help-card">
          <h1>🆘 Help & FAQs</h1>
          <p className="intro">Find answers and gentle guidance to help you navigate your MoodAngels experience.</p>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item" onClick={() => toggleFAQ(i)}>
              <div className="faq-question">
                {faq.q}
                <span>{openFAQ === i ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}</span>
              </div>
              <div className={`faq-answer ${openFAQ === i ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>

        {/* ---------- Chatbot ---------- */}
        {chatOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              Angel
              <X style={{ cursor: "pointer" }} onClick={() => setChatOpen(false)} />
            </div>
            <div className="chatbot-messages" ref={messagesRef}>
              {messages.map((m, i) => (
                <div key={i} className={`message ${m.sender}`}>{m.text}</div>
              ))}
              {typing && <div className="typing">Angel is typing...</div>}
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUserMessage(input)}
              />
              <button onClick={() => handleUserMessage(input)}>Send</button>
            </div>
            <div className="chatbot-quick">
              {quickOptions.map((q, i) => (
                <button key={i} onClick={() => handleOptionClick(q)}>{q}</button>
              ))}
            </div>
          </div>
        )}
        <div className="chatbot-button" onClick={() => setChatOpen(!chatOpen)}>
          {chatOpen ? <X color="white"/> : <MessageCircle color="white"/>}
        </div>
      </div>
      <style>{css}</style>
    </UserWrapper>
  );
}
