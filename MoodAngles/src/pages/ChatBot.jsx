import React, { useState, useEffect, useRef } from "react";

export default function MentalHealthChat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "🌸 Hi there, beautiful soul. I’m Luna — your little space to breathe and share. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => handleBotReply(input.trim().toLowerCase()), 600);
  };

  const handleBotReply = (text) => {
    let reply = "";

    // === Topic-aware replies ===
    if (/(sad|depress|unhappy|down)/.test(text)) {
      reply =
        "💛 It’s okay to feel sad sometimes — emotions remind us we’re alive. Try writing your thoughts down or cuddling something soft; comfort matters.";
    } else if (/(anxiety|anxious|panic|worry|nervous)/.test(text)) {
      reply =
        "🌿 Breathe in slowly... and out. You’re safe right now. Try grounding yourself — notice 5 things around you, 4 things you can touch, 3 things you can hear.";
    } else if (/(stress|pressure|tired|burnout)/.test(text)) {
      reply =
        "☁️ You’ve been carrying a lot. Take a moment to stretch, sip water, or step outside for fresh air. Tiny pauses can restore peace.";
    } else if (/(sleep|insomnia|rest)/.test(text)) {
      reply =
        "🌙 Trouble sleeping? Try dimming the lights, playing calm sounds, or journaling your thoughts before bed. Your mind deserves rest, too.";
    } else if (/(lonely|alone|isolate)/.test(text)) {
      reply =
        "💌 Loneliness can feel heavy, but you’re not truly alone. Try messaging a friend or joining a kind online space — connection heals quietly.";
    } else if (/(angry|frustrate|mad)/.test(text)) {
      reply =
        "🔥 Anger is often pain in disguise. Try releasing it safely — through art, writing, or even a walk. It’s okay to feel, just don’t let it consume you.";
    } else if (/(self[-\s]?care|mindful|meditate)/.test(text)) {
      reply =
        "🕯️ Self-care isn’t selfish — it’s sacred. Light a candle, journal, or take a slow shower. You deserve gentleness from yourself.";
    } else if (/(love|relationship|heartbreak)/.test(text)) {
      reply =
        "💔 Hearts heal in their own rhythm. Give yourself grace — love lost isn’t your worth lost. Time will soften this ache.";
    } else if (/(motivat|hopeless|stuck)/.test(text)) {
      reply =
        "✨ Progress isn’t always visible, but you’re still growing. Try listing 3 small wins today — even waking up counts.";
    } else {
      reply =
        "🌧️ Sorry, I can only chat about feelings, emotions, or mental well-being. But if your heart’s heavy, I’m here to listen.";
    }

    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');
    .chat-page {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(145deg, #f9e1f0, #e5d4ff, #d1e3ff);
      background-size: 400% 400%;
      animation: dreamyFlow 10s ease infinite;
      font-family: 'Quicksand', sans-serif;
    }

    @keyframes dreamyFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .chat-box {
      width: 420px;
      height: 80vh;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .chat-header {
      background: linear-gradient(90deg, #a88beb, #f8ceec);
      color: white;
      text-align: center;
      padding: 16px;
      font-size: 1.2rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .chat-body {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: transparent;
    }

    .message {
      max-width: 75%;
      padding: 10px 14px;
      border-radius: 20px;
      font-size: 0.95rem;
      line-height: 1.5;
      animation: fadeIn 0.4s ease;
    }

    .user-msg {
      align-self: flex-end;
      background: #c8f7c5;
      color: #333;
      border-bottom-right-radius: 5px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .bot-msg {
      align-self: flex-start;
      background: #fff;
      border-bottom-left-radius: 5px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .chat-input {
      display: flex;
      padding: 12px;
      background: rgba(255,255,255,0.8);
      border-top: 1px solid rgba(0,0,0,0.1);
      backdrop-filter: blur(10px);
    }

    .chat-input input {
      flex: 1;
      border: none;
      background: #f0f0f0;
      border-radius: 25px;
      padding: 12px 16px;
      font-size: 0.95rem;
      outline: none;
      color: #333;
      transition: all 0.3s ease;
    }

    .chat-input input:focus {
      background: #fff;
      box-shadow: 0 0 8px rgba(168, 139, 235, 0.3);
    }

    .chat-input button {
      margin-left: 10px;
      border: none;
      border-radius: 50%;
      width: 46px;
      height: 46px;
      background: linear-gradient(135deg, #a88beb, #f8ceec);
      color: white;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.3s ease;
    }

    .chat-input button:hover {
      transform: scale(1.1);
      box-shadow: 0 0 12px rgba(168, 139, 235, 0.5);
    }

    /* Scrollbar style */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-thumb {
      background: #c7b7f3;
      border-radius: 10px;
    }
  `;

  return (
    <div className="chat-page">
      <style>{styles}</style>
      <div className="chat-box">
        <div className="chat-header">💬 Luna — Your Calm Space</div>

        <div className="chat-body">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form className="chat-input" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type how you feel..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">➤</button>
        </form>
      </div>
    </div>
  );
}
