// backend/agents/agentC.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * runAgentC
 * Handles conversational clinical queries and integrates with Agent R / D.
 * @param {Object} payload
 * @param {string} payload.userId
 * @param {string} payload.message - User's message or question
 * @param {Object} [payload.context] - optional previous context or last diagnosis
 */
export async function runAgentC({ userId, message, context = {} }) {
  const prompt = `
You are Angel.C, an empathetic AI mental-health assistant.
Your job:
1. Understand the user's concern.
2. Summarize symptoms and, if sufficient, infer possible mood/anxiety context.
3. If diagnostic context exists (from Angel R or D), reference it briefly.
4. Reply in a professional yet warm tone.
5. Return strict JSON:
{
  "reply": "<your conversational message>",
  "intent": "<followup|diagnostic|support|crisis|general>",
  "next_action": "<none|ask_more|run_AgentR|run_AgentD>",
  "summary": "<one-sentence summary of user's issue>"
}

User ID: ${userId}
User message: "${message}"
Context: ${JSON.stringify(context)}
`;

  try {
    const response = await client.chat.completions.create({
      model: process.env.LLM_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = response.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(text.trim());
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : { reply: text.trim(), intent: "general", next_action: "none", summary: "" };
    }
    parsed.userId = userId;
    return parsed;
  } catch (err) {
    console.error("AgentC error:", err.message);
    return { reply: "I'm sorry, something went wrong processing your message.", intent: "error", next_action: "none" };
  }
}
