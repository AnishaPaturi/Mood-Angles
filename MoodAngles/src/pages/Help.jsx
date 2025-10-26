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
              {/* FIX: Added onClick to stop the event from bubbling up and closing the FAQ item */}
              <div 
                className={`faq-answer ${openFAQ === i ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>

        {/* Chatbot */}
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