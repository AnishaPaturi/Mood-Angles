// backend/routes/chatbotRoute.js
import express from "express";
import fetch from "node-fetch";
import { getContext, formatContext, buildMessages, SYSTEM_PROMPT } from "../rag/ragChain.js";

const router = express.Router();

const PRETTY = {
  depression: "depression",
  anxiety: "anxiety",
  adhd: "ADHD",
  bipolar: "bipolar disorder",
  autism: "autism spectrum disorder",
  neuro: "neurodivergence",
  personality: "personality assessment",
  eq: "emotional intelligence",
  mentalhealth: "mental health",
};

/**
 * Build a condition-interpretation string synchronously.
 * Used as an LLM-free fallback whenever the OpenRouter API is unreachable
 * but the user has test results in the request payload.
 */
function buildConditionReply(tr) {
  if (!tr || tr.score == null) return null;

  const type  = (tr.testType  || "").toLowerCase();
  const score = tr.score;
  const level = tr.level  || "";
  const pretty = PRETTY[type] || tr.testType || "your assessment";
  const num   = typeof score === "number" ? `**${score}%**` : `**${score}**`;

  if (type === "depression") {
    const b = +score < 10 ? "minimal" : +score < 20 ? "mild" : +score < 30 ? "moderate" : "severe";
    return `
Thank you for asking about your results. 🌙

Your PHQ-9 score is ${num} (${level}), which falls in the **${b}** range for depression symptoms.
${+score >= 30 ? "That is significant — I'd strongly recommend speaking with a clinician as soon as possible." : +score >= 20 ? "These are moderate symptoms — discussing this with a doctor or therapist would be a healthy next step." : +score >= 10 ? "Mild symptoms that are worth monitoring and bringing up in a clinical appointment." : "Minimal symptoms that are within the normal range — keep checking in with yourself."}

A formal diagnosis always comes from a qualified professional. We have resources on our [Support](/support) page that can help. 💛
    `.trim();
  }

  if (type === "anxiety") {
    const b = +score < 5 ? "minimal" : +score < 10 ? "mild" : +score < 15 ? "moderate" : "moderately severe";
    return `
Thank you for asking about your results. 🌿

Your GAD-7 score is ${num} (${level}), which falls in the **${b}** range for anxiety-related symptoms.
${+score >= 15 ? "These are significant symptoms — reaching out to a healthcare professional could really help." : +score >= 10 ? "Moderate anxiety — speaking with a therapist could make a big difference." : +score >= 5 ? "Mild anxiety symptoms that are worth chatting through with a professional." : "Minimal anxiety symptoms within the normal range."}

Our [Support](/support) page has practical coping strategies you can start using right now. A quick breath: inhale 4, hold 2, exhale 6. 🌙
    `.trim();
  }

  if (type === "adhd") {
    const b = +score < 40 ? "some" : +score < 60 ? "moderate" : "significant";
    return `
Thank you for asking about your results. 🌙

Your ADHD screening score is ${num} (${level}), suggesting **${b}** ADHD-related symptoms.
${+score >= 60 ? "These are notable enough that I'd recommend seeing a psychologist or psychiatrist for a full evaluation." : +score >= 40 ? "Moderate symptoms — a specialist can help you understand the full picture." : "Keep an eye on it and bring it up in any future appointments if concerns continue."}

ADHD typically shows up in attention, focus, and impulse-control areas. You can find more resources on our [Support](/support) page. 💛
    `.trim();
  }

  return `
Thank you for asking about your ${pretty} results. 🌙

Your result is ${num} (${level}).
I'd really recommend discussing these findings with a qualified healthcare professional — they can give you the personalised support you deserve. You can also visit our [Support](/support) page for more resources. 💛
  `.trim();
}

/**
 * POST /api/chatbot/chat
 * Body: { message: string, history?: [{ sender: 'user' | 'assistant', text: string }] }
 * Auth header / body: userId (required for RAG context retrieval)
 */
router.post("/chat", async (req, res) => {
  try {
    const { message, history = [], context } = req.body;

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
    
    /* ── Build test result context for diagnosis ─────────────────── */
    if (context?.testResult) {
      const tr = context.testResult;
      const resultContext = `
PREVIOUS TEST RESULTS CONTEXT:
Test: ${tr.testType}
Current Score: ${tr.score}%
Level: ${tr.level}
${tr.previousResults && tr.previousResults.length > 0 
  ? `Previous attempts: ${tr.previousResults.map(r => `score:${r.score}, level:${r.level}`).join('; ')}`
  : 'No previous attempts'}

INTERPRETATION:
Based on the ${tr.testType} assessment with a score of ${tr.score}% (${tr.level}), provide an accurate diagnosis interpretation. Consider the DSM-5 criteria and explain what this score means in plain terms. Discuss possible symptoms, severity indicators, and recommended next steps without giving clinical advice.
`;
      contextDocs.push({ pageContent: resultContext, source: "test_results" });
      contextUsed = true;
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

    // context may be absent when this route is used without navigation state
    const tr =
      typeof req?.body === "object"
        ? req.body?.context?.testResult
        : null;

    // Provide a condition-interpretation reply even when the LLM / OpenRouter
    // call failed, as long as we have test results in the payload.
    if (tr && tr.score != null) {
      const genericReply = buildConditionReply(tr);
      console.info("[Chatbot] OpenRouter unavailable, using condition summary fallback.");
      return res.status(200).json({
        reply: genericReply,
        rag:   { chunks: 0, used: false },
        note:  "offline_mode",
      });
    }

    // No test context — return the generic offline message.
    res.status(502).json({
      reply: "I'm experiencing some technical difficulties right now. Please try again in a moment. I'm still here whenever you feel ready to talk. 💛",
      rag:   { chunks: 0, used: false },
    });
  }
});

export default router;
