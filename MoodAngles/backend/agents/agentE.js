// backend/agents/agentE.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function runAgentE({ userId, text }) {
  if (!text) throw new Error("Missing input text");

  const prompt = `
You are Angel.E — an empathic emotion analysis agent.
Analyze the emotional tone and underlying needs of this user message.

Return STRICT JSON:
{
  "primary_emotion": "<one dominant emotion>",
  "secondary_emotions": ["<optional others>"],
  "intensity": "<low|moderate|high>",
  "empathy_level_required": "<low|medium|high>",
  "summary": "<short emotional interpretation>",
  "suggested_response": "<empathetic reply the system could give>"
}

User text:
"""${text}"""
`;

  const completion = await client.chat.completions.create({
    model: process.env.LLM_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  let content = completion.choices[0].message.content.trim();
  let result;
  try {
    result = JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    result = match ? JSON.parse(match[0]) : {
      primary_emotion: "neutral",
      secondary_emotions: [],
      intensity: "low",
      empathy_level_required: "low",
      summary: "Neutral or mixed emotional tone detected.",
      suggested_response: "I'm here to listen — would you like to tell me more about how you feel?",
    };
  }

  return { userId, ...result, timestamp: new Date() };
}
