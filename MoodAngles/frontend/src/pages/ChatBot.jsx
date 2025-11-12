import React, { useState, useEffect, useRef } from "react";
import UserWrapper from "../components/UserWrapper";

export default function MentalHealthChat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey, I’m Luna. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expectingDetail, setExpectingDetail] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const crisisKeywords = [
    "suicide","kill myself","want to die","end my life","hang myself",
    "hurt myself","overdose","self harm","cut myself","cutting"
  ];
  const selfHarmInstructionKeywords = [
    "how to die","ways to die","how to kill myself","how to overdose","how to hang myself"
  ];
  const profanity = ["shit", "fuck", "bitch", "bullshit", "damn", "crap"];
  const sadness = ["sad","down","depress","cry","hopeless","unhappy"];
  const anxiety = ["anxious","anxiety","panic","panic attack","worry","nervous"];
  const stress = ["stress","pressured","overwhelmed","burnout"];
  const sleep = ["sleep","tired","insomnia","restless"];
  const loneliness = ["lonely","alone","isolated"];
  const anger = ["angry","mad","rage","furious","annoyed"];
  const motivation = ["unmotivated","stuck","hopeless","no energy"];
  const badDay = ["my day is bad","bad day","rough day","terrible day","awful day"];
  const offTopic = [
    "weather","code","program","movie","sports","football","cricket","news",
    "president","prime minister","math","python","javascript","react","html"
  ];

  const includesAny = (text, list) => list.some((kw) => text.toLowerCase().includes(kw));

  const pushBot = async (text, delayTime = 1000) => {
    setIsTyping(true);
    await delay(delayTime);
    setIsTyping(false);
    setMessages((p) => [...p, { sender: "bot", text }]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((p) => [...p, { sender: "user", text: userText }]);
    setInput("");
    await delay(400);
    handleBotReply(userText);
  };

  const handleBotReply = async (rawText) => {
    const text = rawText.toLowerCase();

    if (includesAny(text, crisisKeywords)) {
      if (includesAny(text, selfHarmInstructionKeywords)) {
        await pushBot("I’m really sorry you’re feeling this way, but I can’t share anything that could harm you. If you’re in danger, please call your local emergency number (like 112 in India).");
        await pushBot("You can also reach out to these helplines:\n- KIRAN: 1800-599-0019\n- TeleMANAS: 14416\n- International: befrienders.org");
        return;
      }
      await pushBot("That sounds really serious. I care about your safety. Would you like me to share some trusted helpline numbers?");
      return;
    }

    if (includesAny(text, profanity)) {
      await pushBot("Hey, I get that you’re upset, but let’s keep our chat kind. I’m here for you — we can talk about what’s bothering you, okay?");
      return;
    }

    if (includesAny(text, offTopic)) {
      await pushBot("That’s not really something I can help with — I’m here to talk about you, your feelings, and what’s been on your mind lately.");
      return;
    }

    if (includesAny(text, badDay)) {
      setExpectingDetail(true);
      await pushBot("I’m sorry your day’s been rough. Want to tell me what made it so hard? I’m listening.");
      return;
    }

    if (expectingDetail) {
      setExpectingDetail(false);
      await pushBot("That sounds really heavy. I can see why that would get to you. I’m glad you decided to share it — sometimes that’s the first step to feeling a bit lighter.");
      return;
    }

    const matched = [];
    if (includesAny(text, sadness)) matched.push("sad");
    if (includesAny(text, anxiety)) matched.push("anxious");
    if (includesAny(text, stress)) matched.push("stressed");
    if (includesAny(text, sleep)) matched.push("tired");
    if (includesAny(text, loneliness)) matched.push("lonely");
    if (includesAny(text, anger)) matched.push("angry");
    if (includesAny(text, motivation)) matched.push("unmotivated");

    if (matched.length) setEmotions((p) => [...p, ...matched]);

    if (matched.includes("sad")) await pushBot("That sounds really hard. It’s okay to feel that way sometimes. I’m here to listen if you want to share more.");
    else if (matched.includes("anxious")) await pushBot("Anxiety can feel really uncomfortable. Try to take a slow, steady breath with me — in for 4, hold for 2, out for 6.");
    else if (matched.includes("stressed")) await pushBot("You’ve been carrying a lot, haven’t you? It’s okay to pause and breathe for a moment.");
    else if (matched.includes("tired")) await pushBot("Rest is important. You deserve it. Have you had any chance to take a break?");
    else if (matched.includes("lonely")) await pushBot("Feeling alone can be tough. I’m here with you right now. You’re not by yourself in this moment.");
    else if (matched.includes("angry")) await pushBot("Anger usually hides something deeper — maybe hurt or frustration. Do you want to talk about what’s behind it?");
    else if (matched.includes("unmotivated")) await pushBot("That stuck feeling can be heavy. Maybe start small — even one tiny thing can make a difference. Want to think of one together?");
    else await pushBot("I’m listening. Tell me what’s been on your mind — I’ll do my best to understand.");

    const recent = [...emotions, ...matched];
    const count = recent.filter((e) => e === "anxious").length;
    if (count >= 3) {
      await pushBot("I’ve noticed you’ve mentioned feeling anxious a few times. Would you like to try a short breathing exercise together?");
    }
  };

  // ------------------ Dreamy UI Styles ------------------
  const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');
  .chat-page {
    display:flex;justify-content:center;align-items:center;
    height:calc(100vh - 70px);
    background:linear-gradient(145deg,#f9e1f0,#e5d4ff,#d1e3ff);
    background-size:400% 400%;
    animation:dreamFlow 10s ease infinite;
    font-family:'Quicksand',sans-serif;
  }
  @keyframes dreamFlow {
    0%{background-position:0 50%}50%{background-position:100% 50%}100%{background-position:0 50%}
  }
  .chat-box {
    width:420px;max-width:90%;height:80vh;
    background:rgba(255,255,255,0.7);
    backdrop-filter:blur(20px);
    border-radius:25px;
    box-shadow:0 10px 40px rgba(0,0,0,0.1);
    display:flex;flex-direction:column;overflow:hidden;
  }
  .chat-header {
    background:linear-gradient(90deg,#a78bfa,#f0abfc);
    color:white;text-align:center;padding:16px;
    font-weight:600;font-size:1.1rem;
    box-shadow:0 2px 8px rgba(0,0,0,0.1);
  }
  .chat-body {
    flex:1;padding:20px;overflow-y:auto;
    display:flex;flex-direction:column;gap:12px;
  }
  .message {
    display:flex;align-items:flex-end;gap:8px;
    animation:fadeIn 0.3s ease;
  }
  @keyframes fadeIn {
    from{opacity:0;transform:translateY(8px)}
    to{opacity:1;transform:translateY(0)}
  }
  .bubble {
    max-width:75%;padding:12px 16px;
    border-radius:18px;font-size:0.95rem;
    line-height:1.45;white-space:pre-wrap;
  }
  .bot .bubble {
    background:#fff;color:#1e293b;
    border-bottom-left-radius:6px;
  }
  .user .bubble {
    background:linear-gradient(135deg,#a78bfa,#f0abfc);
    color:white;border-bottom-right-radius:6px;
    align-self:flex-end;
  }
  .avatar {
    width:34px;height:34px;border-radius:50%;
    background:linear-gradient(135deg,#a78bfa,#f0abfc);
    display:flex;justify-content:center;align-items:center;
    color:white;font-weight:600;font-size:0.9rem;
    box-shadow:0 0 6px rgba(0,0,0,0.1);
  }
  .typing {
    display:flex;align-items:center;gap:8px;
    margin-left:4px;
  }
  .dot {
    width:8px;height:8px;border-radius:50%;
    background:#94a3b8;animation:blink 1.4s infinite both;
  }
  .dot:nth-child(2){animation-delay:0.2s}
  .dot:nth-child(3){animation-delay:0.4s}
  @keyframes blink {
    0%,80%,100%{opacity:0}40%{opacity:1}
  }
  .chat-input {
    display:flex;padding:10px;
    background:rgba(255,255,255,0.6);
    border-top:1px solid rgba(0,0,0,0.08);
  }
  .chat-input input {
    flex:1;background:#f1f5f9;
    border-radius:25px;padding:12px 16px;
    border:none;outline:none;font-size:1rem;
  }
  .chat-input button {
    background:linear-gradient(135deg,#a78bfa,#f0abfc);
    border:none;color:white;
    border-radius:50%;width:44px;height:44px;
    margin-left:8px;cursor:pointer;font-weight:bold;
  }`;

  return (
    <UserWrapper>
      <style>{styles}</style>
      <div className="chat-page">
        <div className="chat-box">
          <div className="chat-header">Luna — here to listen 💬</div>
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>
                {msg.sender === "bot" && <div className="avatar">L</div>}
                <div className="bubble">{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="typing">
                <div className="avatar">L</div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form className="chat-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">➤</button>
          </form>
        </div>
      </div>
    </UserWrapper>
  );
}
