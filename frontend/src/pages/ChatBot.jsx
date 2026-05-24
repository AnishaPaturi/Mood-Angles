import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function MentalHealthChat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const API_BASE =
    (import.meta.env.DEV
      ? import.meta.env.VITE_LOCAL_BACKEND
      : import.meta.env.VITE_PROD_BACKEND) || "http://localhost:5000";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const initMessages = [{
      sender: "bot",
      text: "Hey there, I'm Luna. I'm here to listen — how are you really feeling today?",
    }];
    
    // Check for test result context from URL state
    if (location.state?.testResult) {
      const ctx = location.state.testResult;
      const score = ctx.score || 0;
      const level = ctx.level || "";
      const testType = ctx.testType || "assessment";
      
      initMessages[0] = {
        sender: "bot",
        text: `I see you just completed the ${testType} assessment with a score of ${score}% (${level}). I'm Luna, and I'll provide you with an accurate interpretation of your results and what they might mean. Let me analyze your responses and previous progress to give you a comprehensive understanding. 🌙`
      };
    }
    
    setMessages(initMessages);
   }, [location.state]);

  // Parse test result context once, available to reply helpers.
  const rawResponse = (location.state?.testResult) || null;
  const tr = rawResponse && typeof rawResponse === "object" ? rawResponse : null;
  const trScore  = tr  ? (tr.score  ?? null)                       : null;
  const trLevel  = tr  ? (tr.level  ?? "")                          : "";
  const trType   = tr  ? (tr.testType ?? "")                        : "";

  const getConditionReply = (text) => {
    if (!/(explain|what (does|is|are)|mean|tell me|what's|condition|symptoms|result|score|next step)/.test(text)) return null;
    if (!trScore && !trType)                                        return null;

    const prettyType = ({ depression:"depression", anxiety:"anxiety", adhd:"ADHD",
                          bipolar:"bipolar disorder", autism:"autism spectrum",
                          neuro:"neurodivergence", personality:"personality assessment",
                          eq:"emotional intelligence", mentalhealth:"mental health" }[trType.toLowerCase()] || trType);
    const num = typeof trScore === "number" ? trScore : (text.match(/\d+/) || [])[0];

    switch (trType) {
      case "depression": {
        if (!num) return null;
        const b = +num < 10 ? "minimal" : +num < 20 ? "mild" : +num < 30 ? "moderate" : "severe";
        return `Your PHQ-9 result is ${trScore}% (${trLevel}), which falls in the **${b}** range for depression symptoms. ${+num >= 30 ? "That's significant and I'd strongly recommend speaking with a clinician as soon as possible." : +num >= 20 ? "Moderate symptoms — discussing this with a doctor or therapist would be a really healthy next step." : +num >= 10 ? "Mild symptoms that are worth monitoring and discussing in a clinical setting." : "Minimal symptoms that are within the normal range — keep checking in with yourself."} A formal diagnosis always comes from a qualified professional. Our [Support](/support) page has resources too. 🌙`;
      }
      case "anxiety": {
        if (!num) return null;
        const b = +num < 5 ? "minimal" : +num < 10 ? "mild" : +num < 15 ? "moderate" : "moderately severe";
        return `Your GAD-7 score is ${num}% (${trLevel}), indicating **${b}** anxiety symptoms. ${+num >= 15 ? "These are significant symptoms and a clinician could really help you work through them." : +num >= 10 ? "Moderate anxiety — speaking with a therapist could make a big difference." : +num >= 5 ? "Mild anxiety symptoms worth monitoring and talking through with a pro." : "Minimal symptoms in the normal range."} You can always visit our [Support](/support) page for coping strategies. Inhale 4, hold 2, exhale 6 — try it now. 🌿`;
      }
      case "adhd": {
        if (!num) return null;
        const b = +num < 40 ? "some" : +num < 60 ? "moderate" : "significant";
        return `Your ADHD screening score is ${num} (${trLevel}), suggesting **${b}** ADHD-related symptoms. ADHD typically shows up in attention, focus, and impulse control areas. ${+num >= 60 ? "These are notable enough that I'd encourage you to see a psychologist or psychiatrist for a full evaluation." : +num >= 40 ? "A psychologist or psychiatrist can help understand the full picture." : "Keep an eye on it and bring it up in any future appointments."} You can find more resources on our [Support](/support) page. 🌙`;
      }
      default:
        return `Thank you for asking. Your ${prettyType} result is **${trLevel}**${num ? ` (${num}%)` : ""}. I'd really recommend discussing these findings with a qualified healthcare professional — they can give you the personalised support you deserve. You can also visit our [Support](/support) page for helpful resources. 💛`;
    }
  };

  const getStaticReply = (text) => {
    if (/(fuck|shit|bitch|bullshit|damn|crap)/.test(text)) {
      return "I understand that you're feeling emotional and going through a lot right now. But can we please avoid using rude language here? I want this to be a safe, peaceful space for you to open up. I'm here to help you — you can let it out, just gently. 💛";
    }
    if (/(sad|depress|unhappy|down|hopeless)/.test(text)) {
      return "It's okay to feel sad sometimes. You don't have to hide it — everyone has days that feel too heavy. I'm here to listen if you'd like to talk about what's been on your mind. 💛";
    }
    if (/(anxiety|anxious|panic|worry|nervous|overwhelm)/.test(text)) {
      return "That sounds really tough. Take a slow, deep breath with me... inhale for 4, hold for 2, exhale for 6. You're safe here — you're not alone. 🌿";
    }
    if (/(stress|pressure|burnout|overwork|tired|exhaust)/.test(text)) {
      return "Seems like you've been holding a lot inside. You deserve a moment to just breathe and rest. Maybe take a sip of water or step away from the noise for a minute. ☁️";
    }
    if (/(sleep|insomnia|can't sleep|cant sleep|rest)/.test(text)) {
      return "It's hard when your mind won't slow down enough to rest. Maybe dim the lights, play something soft, or just focus on breathing for a few moments. 🌙";
    }
    if (/(lonely|alone|isolate|no one|nobody)/.test(text)) {
      return "Feeling lonely can hurt deeply. But please know — I'm right here with you, listening. Even small connections count, and you're not invisible. 💌";
    }
    if (/(angry|frustrat|mad|annoy|irritat)/.test(text)) {
      return "I get it. Anger can feel intense and messy, but it's okay to feel it. You can talk to me about what caused it — sometimes putting it into words helps release some of that weight. 🔥";
    }
    if (/(self[-\s]?care|mindful|meditat|grounding|breathing)/.test(text)) {
      return "That's wonderful to hear. Self-care isn't selfish — it's how we rebuild ourselves. Even small acts like stretching, breathing, or journaling can calm your mind. 🕯️";
    }
    if (/(love|relationship|heartbreak|break up|breakup)/.test(text)) {
      return "Heartbreak hurts more than most things, doesn't it? You gave love your best — that's something to be proud of. It'll take time, but you'll feel light again. 💔";
    }
    if (/(motivat|hopeless|stuck|lost|give up|cant do this)/.test(text)) {
      return "When motivation fades, even small things feel huge. That's okay — progress isn't about speed. What's one tiny thing you could do right now to feel a bit better? 🌤️";
    }
    if (/(happy|joy|excite|grateful|glad|thankful)/.test(text)) {
      return "I'm so glad to hear that! Moments of happiness are precious. Hold onto that feeling and let it brighten your day. Remember, I'm here whenever you want to share more. 🌈";
    }

    // ── NEW: quickly help with anything the AI unreachable fallback can't answer.
    // The chatbotRoute.js catch-handler now sends a contextual condition summary
    // for all queries when testResult is present; this gate only fires for
    // generic "I don't know" misses.
    const cond = getConditionReply(text);
    if (cond) return cond;

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
        body: JSON.stringify({ 
          message: input.trim(), 
          history,
          context: location.state?.testResult || null
        }),
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
