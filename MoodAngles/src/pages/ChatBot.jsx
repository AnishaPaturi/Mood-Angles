import React, { useState, useEffect, useRef } from "react";

/**
 * MentalHealthChat v2
 * - Improved intent detection
 * - Crisis handling (suicide / self-harm): empathetic reply + helpline suggestions
 * - Professional referral/disclaimer
 *
 * Note: This component is NOT a substitute for professional care.
 * If a user is in immediate danger, instruct them to call local emergency services.
 */

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
    "suicide",
    "kill myself",
    "want to die",
    "end my life",
    "i'll die",
    "i will die",
    "i want to die",
    "hang myself",
    "overdose",
    "hurt myself",
    "self harm",
    "cutting",
    "cut myself",
    "i'm going to kill myself",
  ];

  // keywords that indicate the user might be asking for instructions for self-harm
  const selfHarmInstructionKeywords = [
    "how to kill myself",
    "how do i kill myself",
    "best way to die",
    "ways to die",
    "fastest way to die",
    "how to overdose",
    "how to hang myself",
    "how to cut myself",
  ];

  const anxietyKeywords = ["anxiety", "anxious", "panic", "panic attack", "worry", "nervous"];
  const sadnessKeywords = ["sad", "depress", "unhappy", "down", "hopeless"];
  const stressKeywords = ["stress", "pressure", "burnout", "overwhelmed", "stressed"];
  const sleepKeywords = ["sleep", "insomnia", "rest", "can't sleep", "sleepless"];
  const lonelinessKeywords = ["lonely", "alone", "isolate", "isolation"];
  const angerKeywords = ["angry", "frustrate", "mad", "rage"];
  const relationshipKeywords = ["love", "relationship", "breakup", "heartbreak"];
  const motivationKeywords = ["motivat", "stuck", "hopeless", "no energy"];

  // Helper: case-insensitive includes any keyword
  const includesAny = (text, list) =>
    list.some((kw) => text.indexOf(kw.toLowerCase()) !== -1);

  const safePushBotMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    // slight delay to mimic typing
    setTimeout(() => handleBotReply(userText), 350);
  };

  const handleBotReply = (rawText) => {
    const text = rawText.toLowerCase();

    // 1) CRISIS CHECK - highest priority
    if (includesAny(text, crisisKeywords)) {
      // If user is actively asking for instructions for self-harm → refuse + safety instructions
      if (includesAny(text, selfHarmInstructionKeywords)) {
        safePushBotMessage(
          "💛 I’m really sorry you’re feeling this way, but I can’t help with instructions to hurt yourself. " +
            "If you are in immediate danger, please call your local emergency number (for example, 112 in India). " +
            "You can also call a suicide prevention or mental health helpline right now — talking to someone could really help."
        );
        // quick follow-up with numbers / options
        safePushBotMessage(
          "Here are some trusted options you can reach right now:\n\n" +
            "- KIRAN Mental Health Helpline (India): *1800-599-0019*.\n" +
            "- TeleMANAS (India Govt. mental health support): *14416* or 1-800-891-4416.\n" +
            "- International: Befrienders / local crisis lines (find one at befrienders.org).\n\n" +
            "If you want, I can help you find specific local numbers or stay with you here and listen."
        );
        return;
      }

      // If crisis keywords but not explicitly asking for instructions:
      safePushBotMessage(
        "💛 I’m so sorry — this sounds really painful. I’m worried about your safety. If you are in immediate danger, please call your local emergency services right now."
      );

      safePushBotMessage(
        "If you can, please consider contacting a crisis or mental health helpline — talking with a trained person can help in urgent moments. " +
          "Would you like the helpline numbers for India (including KIRAN and TeleMANAS), or an international list?"
      );
      // Optionally here you could open a quick UI giving the numbers and a 'call now' button.
      return;
    }

    // 2) Non-crisis mental health intents
    let reply = "";

    if (includesAny(text, sadnessKeywords)) {
      reply =
        "💛 It’s okay to feel sad sometimes — emotions remind us we’re alive. If it helps, try writing your thoughts down, or telling me what’s on your mind — I’m here to listen.";
    } else if (includesAny(text, anxietyKeywords)) {
      reply =
        "🌿 Breathe with me: in 4, hold 2, out 6. You’re safe right now. If you want, I can guide you through a short grounding exercise.";
    } else if (includesAny(text, stressKeywords)) {
      reply =
        "☁️ You’ve been carrying a lot. Tiny pauses can restore energy: stretch, step outside, or do a 60-second breathing break. Want a guided one?";
    } else if (includesAny(text, sleepKeywords)) {
      reply =
        "🌙 Trouble sleeping? Try dimming screens an hour before bed, journaling for 5 minutes, or a slow breathing practice. Want a bedtime wind-down script?";
    } else if (includesAny(text, lonelinessKeywords)) {
      reply =
        "💌 Loneliness can feel heavy — connection helps. Is there one person you could message right now? If not, I can suggest safe online communities.";
    } else if (includesAny(text, angerKeywords)) {
      reply =
        "🔥 Anger is valid. You might try channeling it through movement (a brisk walk), loud music, or writing unsent letters. Do any of those feel doable?";
    } else if (includesAny(text, relationshipKeywords)) {
      reply =
        "💔 Relationships can hurt deeply. You don’t have to process this alone — talking it out, journaling, or seeing a therapist can make space for healing.";
    } else if (includesAny(text, motivationKeywords)) {
      reply =
        "✨ Feeling stuck happens. Try listing one very small thing you can do in the next 15 minutes — even a single step helps build momentum.";
    } else if (/(self[-\s]?care|mindful|meditat)/.test(text)) {
      reply =
        "🕯️ Self-care is essential. Some quick wins: 1) 5-minute mindful breathing, 2) hydrate & stretch, 3) step outside. Which would you like to try now?";
    } else {
      reply =
        "🌧️ I’m here for feelings and mental wellbeing. If you want, tell me more (what happened? how intense is it?), or say ‘resources’ to get help options.";
    }

    // Add a gentle clinician/referral disclaimer for non-crisis cases when appropriate
    const includeReferral =
      /(suicide|harm|kill myself|psychosis|mania|hallucinat|hear voices|dangerous)/.test(text) === false &&
      (includesAny(text, sadnessKeywords) || includesAny(text, anxietyKeywords) || includesAny(text, stressKeywords));

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: reply },
      includeReferral
        ? {
            sender: "bot",
            text:
              "⚠️ Note: I’m not a clinician. If what you’re describing feels severe, longstanding, or you’re worried about your safety, please reach out to a qualified professional. I can help find nearby options.",
          }
        : null,
    ].filter(Boolean));
  };

  // UI styles kept from your original, slightly cleaned
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
      background: rgba(255, 255, 255, 0.75);
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
      gap: 12px;
      background: transparent;
    }
    .message {
      max-width: 75%;
      padding: 12px 16px;
      border-radius: 20px;
      font-size: 0.95rem;
      line-height: 1.5;
      animation: fadeIn 0.35s ease;
      white-space: pre-wrap;
    }
    .user-msg {
      align-self: flex-end;
      background: #c8f7c5;
      color: #111;
      border-bottom-right-radius: 5px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    }
    .bot-msg {
      align-self: flex-start;
      background: #fff;
      border-bottom-left-radius: 5px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.06);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .chat-input {
      display: flex;
      padding: 12px;
      background: rgba(255,255,255,0.85);
      border-top: 1px solid rgba(0,0,0,0.06);
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
      box-shadow: 0 0 8px rgba(168, 139, 235, 0.25);
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
      transition: transform 0.18s ease, box-shadow 0.22s ease;
    }
    .chat-input button:hover {
      transform: scale(1.06);
      box-shadow: 0 0 10px rgba(168, 139, 235, 0.45);
    }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: #c7b7f3; border-radius: 10px; }
  `;

  return (
    <div className="chat-page">
      <style>{styles}</style>
      <div className="chat-box" role="region" aria-label="Luna mental health chat">
        <div className="chat-header">💬 Luna — Your Calm Space</div>

        <div className="chat-body" aria-live="polite">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
            >
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
            aria-label="Type your message"
          />
          <button type="submit" aria-label="Send">➤</button>
        </form>
      </div>
    </div>
  );
}
