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
          Check your results in <Link to="/dashboard" className="faq-link">Dashboard → Results</Link>. Click any test to view detailed analysis.
        </>
      ),
    },
    {
      q: "How do I contact a professional?",
      a: (
        <>
          Visit <Link to="/Therapist" className="faq-link">Contact Professionals</Link> to message or schedule appointments with certified professionals.
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
  /* ---------- Help Page Styles ---------- */
  .help-section {
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:2rem;
    padding:3rem 1rem;
    background: linear-gradient(to bottom, #ffe5f0, #f0faff);
    min-height:100vh;
  }

  /* ---------- Calming Info Cards ---------- */
  .info-cards {
    display:flex;
    flex-direction:column;
    gap:2rem;
    max-width:1000px;
    width:100%;
  }

  .info-card {
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(15px);
    border-radius:2rem;
    padding:2rem 2.5rem;
    box-shadow:0 20px 50px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    font-family: 'Quicksand', sans-serif;
  }

  .info-card:hover {
    transform: translateY(-3px);
    box-shadow:0 25px 60px rgba(0,0,0,0.12);
  }

  .info-card h2 {
    font-family: 'Poppins', sans-serif;
    font-size:1.8rem;
    color:#ff69b4;
    margin-bottom:1rem;
  }

  .info-card p, .info-card li {
    font-size:1rem;
    line-height:1.6;
    color:#4c4c6b;
  }

  .info-card ul {
    padding-left:1.2rem;
    margin-top:0.5rem;
  }

  /* Combined Help Card */
  .help-card {
    background: rgba(255,255,255,0.98);
    backdrop-filter: blur(20px);
    border-radius:2.5rem;
    padding:4rem 6rem;
    max-width:1600px;
    width:100%;
    box-shadow:0 25px 80px rgba(0,0,0,0.25);
    transition: all 0.3s ease;
  }
  .help-card:hover { transform: translateY(-3px); }

  .help-card h1 { 
    text-align:center; 
    color:#5b5b7a; 
    font-size:2.5rem; 
    margin-bottom:1rem;
  }
  .help-card p.intro { 
    text-align:center; 
    color:#555; 
    font-size:1.1rem; 
    margin-bottom:3rem; 
  }

  .faq-item {
    background: rgba(255,255,255,0.95);
    border-radius:1.8rem;
    padding:1.2rem 1.8rem;
    margin-bottom:1rem;
    cursor:pointer;
    transition: all 0.3s ease;
    display:flex; 
    flex-direction:column;
  }
  .faq-item:hover { 
    background:#fff0f5; 
    transform:translateY(-2px); 
    box-shadow:0 6px 20px rgba(180,180,200,0.18);
  }
  .faq-question { 
    font-weight:600; 
    color:#6b6b8f; 
    display:flex; 
    justify-content:space-between; 
    align-items:center; 
    font-size:1.1rem;
  }
  .faq-answer { 
    margin-top:0.8rem; 
    font-size:1rem; 
    color:#4c4c6b; 
    line-height:1.6; 
    max-height:0; 
    opacity:0; 
    overflow:hidden; 
    transition:all 0.4s ease; 
  }
  .faq-answer.open { 
    max-height:400px; 
    opacity:1; 
  }
  .faq-link { 
    color:#ff69b4; 
    font-weight:500; 
    text-decoration:underline;
  }
  .faq-link:hover { 
    color:#ff1493; 
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
        {/* ---------- Info Cards ---------- */}
        <div className="info-cards">
          {/* Express Yourself */}
          <div className="info-card">
            <h2>🖋 Express Yourself</h2>
            <ul>
              <li>💭 <strong>Mood Journal:</strong> Write freely about your day and tag your feelings with emojis like 😔, 😊, 😤.</li>
              <li>🎙 <strong>Voice Notes:</strong> Record your thoughts aloud and revisit them to reflect on growth.</li>
              <li>✨ <strong>Emotion Doodles:</strong> Draw or color your feelings and save your sketches as "mood art."</li>
              <li>🕊 <strong>Letter You'll Never Send:</strong> Write letters to yourself or others, just to let feelings flow.</li>
              <li>📖 <strong>Thought Jar:</strong> Note strong emotions in a digital jar and track patterns later.</li>
              <li>🌈 <strong>Daily Reflection Prompt:</strong> Get a daily question like "What made you smile today?" or "What do you wish someone told you right now?"</li>
            </ul>
          </div>

          {/* Calm & Relax */}
          <div className="info-card">
            <h2>🧘 Calm & Relax</h2>
            <ul>
              <li>🧘 Short Guided Meditations: 5–10 minutes of focused breathing or visualization.</li>
              <li>💨 Breathing Exercises: Try "4-7-8 breathing" to calm your nervous system.</li>
              <li>🎶 Soothing Sounds: Nature sounds or soft instrumental music for focus and relaxation.</li>
              <li>💬 Motivational Quotes / Affirmations: Repeat "I am safe, I am calm, I am enough."</li>
              <li>🌿 Mini Relaxation Rituals: Stretch, do gentle yoga, or light a scented candle to create calm.</li>
            </ul>
          </div>

          {/* Community Kindness */}
          <div className="info-card">
            <h2>💖 Community Kindness</h2>
            <ul>
              <li>Connect with others and share positivity to uplift mental well-being.</li>
              <li>Read messages or quotes from people who have overcome challenges.</li>
              <li>Post your own encouraging notes — even a small “You are valued” can brighten someone’s day.</li>
              <li>Participate safely in our forums or Discord: <a href="https://discord.gg/moodangles" target="_blank" className="faq-link">discord.gg/moodangles</a></li>
              <li>Reach support via email: <a href="mailto:support@moodangles.com" className="faq-link">support@moodangles.com</a></li>
            </ul>
          </div>

          {/* Safety Reminder */}
          <div className="info-card">
            <h2>🛡 Safety Reminder</h2>
            <ul>
              <li>You are never alone. If you feel hopeless, anxious, or unsafe, reach out to someone you trust.</li>
              <li>Friends, family, or professionals can support you — asking for help is a sign of strength.</li>
              <li>Take small steps to ensure your safety and well-being.</li>
              <li>Remember: Your mental health matters, and seeking help is brave.</li>
            </ul>
          </div>
        </div>

        {/* ---------- Help & FAQs ---------- */}
        <div className="help-card">
          <h1>🆘 Help & FAQs</h1>
          <p className="intro">
            Welcome to the Help Center! Find answers to common questions and guidance on using MoodAngels effectively.
          </p>

          {faqs.map((faq, i) => (
            <div key={i} className="faq-item" onClick={() => toggleFAQ(i)}>
              <div className="faq-question">
                {faq.q}
                <span>{openFAQ === i ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}</span>
              </div>
              <div 
                className={`faq-answer ${openFAQ === i ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
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
