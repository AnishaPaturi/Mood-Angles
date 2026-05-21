// backend/routes/chatbotRoute.js
import express from "express";
import fetch from "node-fetch";
import { getContext, formatContext, buildMessages, SYSTEM_PROMPT } from "../rag/ragChain.js";

const router = express.Router();

/**
 * POST /api/chatbot/chat
 * Body: { message: string, history?: [{ sender: 'user' | 'assistant', text: string }] }
 * Auth header / body: userId (required for RAG context retrieval)
 */
router.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const userId = req.body.userId || null;

    /* ── RAG: retrieve relevant document chunks ─────────────────── */
    let contextDocs = [];
    let contextUsed = false;
    if (userId) {
      try {
        contextDocs = await getContext({ userId, question: message });
        contextUsed  = contextDocs.length > 0;
        if (contextUsed)
          console.log(`[RAG] ${contextDocs.length} chunks retrieved for user ${userId}`);
      } catch (ragErr) {
        console.warn("[RAG] retrieval error (continuing without context):", ragErr?.message);
      }
    }

    const messages = buildMessages(message, history, contextDocs, SYSTEM_PROMPT);

    /* ── Call OpenRouter ────────────────────────────────────────── */
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mood-angles.com",
        "X-Title": "Luna Mental Health Assistant (RAG)",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages,
        max_tokens: 350,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data      = await response.json();
    const reply     = data.choices?.[0]?.message?.content
                  || "I'm having trouble responding right now. Please try again.";

    res.json({
      reply,
      rag: contextUsed
        ? { chunks: contextDocs.length, used: true }
        : { chunks: 0, used: false },
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      reply: "I'm experiencing some technical difficulties. Please try again in a moment. Remember, I'm here to listen.",
      rag:   { chunks: 0, used: false },
    });
  }
});

export default router;
