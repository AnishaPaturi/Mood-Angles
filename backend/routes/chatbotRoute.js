// backend/routes/chatbotRoute.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// System prompt for mental health assistant
const SYSTEM_PROMPT = `You are Luna, a compassionate mental health assistant. You provide emotional support, coping strategies, and mental health resources. You are NOT a licensed therapist, but you can offer guidance and encouragement. Always respond with empathy and validate the user's feelings. Keep responses concise (2-3 sentences max) and supportive. Focus on active listening, emotional validation, and gentle guidance toward self-care. Never provide medical diagnoses or replace professional therapy.

Key guidelines:
- Be empathetic and non-judgmental
- Validate emotions without dismissing them
- Suggest breathing exercises, grounding techniques, or self-care when appropriate
- Encourage professional help for serious concerns
- Never give medical advice or diagnose conditions`;

router.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build messages array with history
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((h) => ({
        role: h.sender === "user" ? "user" : "assistant",
        content: h.text,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mood-angles.com",
        "X-Title": "Luna Mental Health Assistant"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm having trouble responding right now. Please try again.";

    res.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ 
      reply: "I'm experiencing some technical difficulties. Please try again in a moment. Remember, I'm here to listen." 
    });
  }
});

export default router;