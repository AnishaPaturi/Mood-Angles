import React, { useState, useEffect, useRef } from "react";

export default function MentalHealthChat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hey there, I'm Luna. I'm here to listen — how are you really feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const API_BASE =
    (import.meta.env.DEV
      ? import.meta.env.VITE_LOCAL_BACKEND
      : import.meta.env.VITE_PROD_BACKEND) || "http://localhost:5000";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getStaticReply = (text) => {
    if (/(fuck|shit|bitch|bullshit|damn|crap)/.test(text)) {
      return "I understand that you're feeling emotional and going through a lot right now. But can we please avoid using rude language here? I want this to be a safe, peaceful space for you to open up. I'm here to help you — you can let it out, just gently. 💛";
    }
    if (/(sad|depress|unhappy|down)/.test(text)) {
      return "It's okay to feel sad sometimes. You don't have to hide it — everyone has days that feel too heavy. I'm here to listen if you'd like to talk about what's been on your mind. 💛";
    }
    if (/(anxiety|anxious|panic|worry|nervous)/.test(text)) {
      return "That sounds really tough. Take a slow, deep breath with me... inhale for 4, hold for 2, exhale for 6. You're safe here — you're not alone. 🌿";
    }
    if (/(stress|pressure|tired|burnout)/.test(text)) {
      return "Seems like you've been holding a lot inside. You deserve a moment to just breathe and rest. Maybe take a sip of water or step away from the noise for a minute. ☁️";
    }
    if (/(sleep|insomnia|rest)/.test(text)) {
      return "It's hard when your mind won't slow down enough to rest. Maybe dim the lights, play something soft, or just focus on breathing for a few moments. 🌙";
    }
    if (/(lonely|alone|isolate)/.test(text)) {
      return "Feeling lonely can hurt deeply. But please know — I'm right here with you, listening. Even small connections count, and you're not invisible. 💌";
    }
    if (/(angry|frustrate|mad)/.test(text)) {
      return "I get it. Anger can feel intense and messy, but it's okay to feel it. You can talk to me about what caused it — sometimes putting it into words helps release some of that weight. 🔥";
    }
    if (/(self[-\s]?care|mindful|meditate)/.test(text)) {
      return "That's wonderful to hear. Self-care isn't selfish — it's how we rebuild ourselves. Even small acts like stretching, breathing, or journaling can calm your mind. 🕯️";
    }
    if (/(love|relationship|heartbreak)/.test(text)) {
      return "Heartbreak hurts more than most things, doesn't it? You gave love your best — that's something to be proud of. It'll take time, but you'll feel light again. 💔";
    }
    if (/(motivate|hopeless|stuck)/.test(text)) {
      return "When motivation fades, even small things feel huge. That's okay — progress isn't about speed. What's one tiny thing you could do right now to feel a bit better? 🌤️";
    }
    if (/(happy|joy|excite|grateful)/.test(text)) {
      return "I'm so glad to hear that! Moments of happiness are precious. Hold onto that feeling and let it brighten your day. Remember, I'm here whenever you want to share more. 🌈";
    }
    if (/(weather|movie|sports|react|python|code|github|ai|html|javascript|math|game|instagram|youtube|tiktok|login|signup|result)/.test(text)) {
      return "Hmm... that sounds interesting, but it's not really something I can help with. I'm here mainly to talk about how you're feeling — your emotions, stress, or anything on your mind. 💬";
    }
    return "I hear you. That sounds like a lot to hold inside. You can talk to me about it — I'll listen without judgment. Sometimes letting it out is the first step to feeling lighter. 💛";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Convert existing messages to history format for API
    const history = messages.map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    try {
      const response = await fetch(`${API_BASE}/api/chatbot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim(), history }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      } else {
        throw new Error("API failed");
      }
    } catch (err) {
      console.warn("Using fallback responses:", err);
      // Use static fallback for offline mode
      const reply = getStaticReply(input.trim().toLowerCase());
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }
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
        <div className="chat-header">
          💬 Luna — Your Calm Space
          <button
            onClick={() => setMessages([{ sender: "bot", text: "Hey there, I'm Luna. I'm here to listen — how are you really feeling today?" }])}
            style={{
              float: "right",
              background: "rgba(255,255,255,0.3)",
              border: "none",
              borderRadius: "12px",
              padding: "4px 10px",
              fontSize: "0.8rem",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            Clear
          </button>
        </div>

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
