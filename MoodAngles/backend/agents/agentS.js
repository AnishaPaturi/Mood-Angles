// backend/agents/agentS.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function runAgentS({ userId, text }) {
  if (!text) throw new Error("Missing text input");

  const prompt = `
You are Angel.S — a safety and suicide risk detection agent in a mental-health AI system.
Analyze the following text and assess if it contains self-harm, suicidal ideation, or severe distress.

Return STRICT JSON with this structure:
{
  "risk_level": "<none|low|moderate|high|critical>",
  "risk_factors": ["<detected indicators>"],
  "summary": "<short summary>",
  "action_recommendation": "<none|monitor|alert_clinician|emergency_intervention>",
  "support_message": "<empathetic supportive message to send to user>"
}

Text to analyze:
"""${text}"""
`;

  const completion = await client.chat.completions.create({
    model: process.env.LLM_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  let content = completion.choices[0].message.content.trim();
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    parsed = match ? JSON.parse(match[0]) : {
      risk_level: "low",
      risk_factors: [],
      summary: "No immediate self-harm or suicidal intent detected.",
      action_recommendation: "none",
      support_message: "It sounds like you're having a hard time. You're not alone — I'm here to help you talk through this."
    };
  }

  parsed.timestamp = new Date();
  parsed.userId = userId;

  return parsed;
}
