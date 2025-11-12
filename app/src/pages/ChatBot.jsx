import React, { useState, useEffect, useRef } from "react";
import UserWrapper from "../components/UserWrapper"; // ✅ NAVBAR WRAPPER

export default function MentalHealthChat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "🌸 Hi there, beautiful soul. I’m Luna — your little space to breathe and share. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- Safety / intent keyword sets ----
  const crisisKeywords = [
    "suicide", "kill myself", "want to die", "end my life", "i'll die",
    "i will die", "i want to die", "hang myself", "overdose", "hurt myself",
    "self harm", "cutting", "cut myself", "i'm going to kill myself",
  ];

  const selfHarmInstructionKeywords = [
    "how to kill myself", "how do i kill myself", "best way to die", "ways to die",
    "fastest way to die", "how to overdose", "how to hang myself", "how to cut myself",
  ];

  const anxietyKeywords = ["anxiety", "anxious", "panic", "panic attack", "worry", "nervous"];
  const sadnessKeywords = ["sad", "depress", "unhappy", "down", "hopeless"];
  const stressKeywords = ["stress", "pressure", "burnout", "overwhelmed", "stressed"];
  const sleepKeywords = ["sleep", "insomnia", "rest", "can't sleep", "sleepless"];
  const lonelinessKeywords = ["lonely", "alone", "isolate", "isolation"];
  const angerKeywords = ["angry", "frustrate", "mad", "rage"];
  const relationshipKeywords = ["love", "relationship", "breakup", "heartbreak"];
  const motivationKeywords = ["motivat", "stuck", "hopeless", "no energy"];

  const includesAny = (text, list) =>
    list.some((kw) => text.toLowerCase().includes(kw.toLowerCase()));

  const safePushBotMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setTimeout(() => handleBotReply(userText), 350);
  };

    const handleBotReply = (rawText) => {
    const text = rawText.toLowerCase().trim();

    // 🧠 1. Crisis & self-harm detection (do not alter this priority)
    if (includesAny(text, crisisKeywords)) {
      if (includesAny(text, selfHarmInstructionKeywords)) {
        safePushBotMessage(
          "💛 I’m really sorry you’re feeling this way, but I can’t help with instructions to hurt yourself. " +
          "If you are in immediate danger, please call your local emergency number (such as 112 in India)."
        );
        safePushBotMessage(
          "📞 Helpline options:\n- KIRAN Mental Health Helpline (India): 1800-599-0019\n- TeleMANAS: 14416\n- International helplines: befrienders.org\n\nYou are not alone. I'm here with you. ❤️"
        );
        return;
      }

      safePushBotMessage(
        "💛 I’m really sorry — this sounds heavy. Your safety matters. If you are in danger, please call emergency services."
      );
      safePushBotMessage(
        "Would you like local helpline numbers? I can send them. 💗"
      );
      return;
    }

    // 💬 2. Detect overlapping emotional keywords
    const matched = [];
    if (includesAny(text, sadnessKeywords)) matched.push("sad");
    if (includesAny(text, anxietyKeywords)) matched.push("anxious");
    if (includesAny(text, stressKeywords)) matched.push("stressed");
    if (includesAny(text, sleepKeywords)) matched.push("sleep");
    if (includesAny(text, lonelinessKeywords)) matched.push("lonely");
    if (includesAny(text, angerKeywords)) matched.push("angry");
    if (includesAny(text, motivationKeywords)) matched.push("unmotivated");

    // 🌤 3. Multi-emotion response
    if (matched.length > 1) {
      safePushBotMessage(
        `💛 I'm hearing a mix of feelings — ${matched.join(" and ")}. It's okay to feel more than one thing at once. Let's take it one breath at a time.`
      );
      return;
    }

    // 🌻 4. Specific positive / motivational fallback detection
   if (
    text.includes("positive") ||
    text.includes("inspire") ||
    text.includes("motivate") ||
    text.includes("hope") ||
    text.includes("happy")
  ) {
    const positiveReplies = [
      "🌻 Here's something gentle: even the smallest sunrise can chase away the darkest night. You’ve survived 100% of your worst days — that’s strength. 💫",
      "🌞 Remember: you are allowed to start again, as many times as you need. The world still has soft mornings waiting for you. ☕",
      "🌈 You don’t have to be perfect to be amazing. Even resting is an act of courage. 💖",
      "🌷 Hey, breathe. You made it here today, and that already matters more than you think. 🌤"
    ];
    const reply = positiveReplies[Math.floor(Math.random() * positiveReplies.length)];
    safePushBotMessage(reply);
    return;
  }


    // 💛 5. Single-emotion branches
    let reply = "";
    if (matched.includes("sad"))
      reply = "💛 It's okay to feel sad. I'm here. Tell me what’s making you feel this way?";
    else if (matched.includes("anxious"))
      reply = "🌿 Let’s breathe together... In 4, hold 2, out 6. You're safe now.";
    else if (matched.includes("stressed"))
      reply = "☁️ You're carrying a lot. Would you like a 60-second grounding exercise?";
    else if (matched.includes("sleep"))
      reply = "🌙 Trouble sleeping can be draining. Want a calming bedtime routine suggestion?";
    else if (matched.includes("lonely"))
      reply = "💌 You deserve connection. I'm here with you right now. Want to talk about what feels lonely?";
    else if (matched.includes("angry"))
      reply = "🔥 Anger is valid. Would letting it out through music or walking help?";
    else if (matched.includes("unmotivated"))
      reply = "✨ One tiny step can restart momentum. What's one small thing you could do in the next 15 minutes?";
    else
      // 🌸 6. Gentle default fallback
      reply = "🌸 I'm here and listening. Tell me what's been weighing on your heart today?";

    safePushBotMessage(reply);
  };


  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');
    .chat-page {
      display: flex; justify-content: center; align-items: center;
      height: calc(100vh - 70px); /* ✅ leaves room for navbar */
      background: linear-gradient(145deg, #f9e1f0, #e5d4ff, #d1e3ff);
      background-size: 400% 400%; animation: dreamyFlow 10s ease infinite;
      font-family: 'Quicksand', sans-serif;
    }
    @keyframes dreamyFlow { 0%{background-position:0 50%}50%{background-position:100% 50%}100%{background-position:0 50%} }
    .chat-box { width: 420px; height: 80vh; background: rgba(255,255,255,.75); backdrop-filter: blur(20px);
      border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,.1); display: flex; flex-direction: column; overflow: hidden; }
    .chat-header { background: linear-gradient(90deg, #a88beb, #f8ceec); color:white; text-align:center; padding:16px; font-size:1.2rem; font-weight:600; }
    .chat-body { flex:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:12px; }
    .message { max-width:75%; padding:12px 16px; border-radius:20px; white-space:pre-wrap; font-size:0.95rem; line-height:1.5; }
    .user-msg { align-self:flex-end; background:#c8f7c5; border-bottom-right-radius:5px; }
    .bot-msg { align-self:flex-start; background:#fff; border-bottom-left-radius:5px; }
    .chat-input { display:flex; padding:12px; background:rgba(255,255,255,0.85); border-top:1px solid rgba(0,0,0,0.06); }
    .chat-input input { flex:1; background:#f0f0f0; border-radius:25px; padding:12px 16px; border:none; }
    .chat-input button { margin-left:10px; width:46px; height:46px; border-radius:50%; border:none;
      background:linear-gradient(135deg,#a88beb,#f8ceec); color:white; cursor:pointer; font-weight:bold; }
  `;

  return (
    <UserWrapper> {/* ✅ NAVBAR APPEARS NOW */}
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
    </UserWrapper>
  );
}
