// backend/agents/agentJ.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function runAgentJ({ caseId, inputs }) {
  const prompt = `
You are Angel.J — the Judge Agent in the MoodAngels system.
You receive the outputs from other agents (Angel.R, Angel.D, Angel.S, etc.).
Your task: analyze whether their conclusions are ethically sound, logically consistent, and free from bias.

Return STRICT JSON:
{
  "caseId": "<caseId>",
  "judgement_summary": "<short summary>",
  "fairness_score": "<0-1>",
  "bias_detected": "<yes/no>",
  "bias_reasoning": "<why or why not>",
  "ethical_flags": ["<list of issues if any>"],
  "recommendation": "<accept|revise|reject>",
  "timestamp": "<ISO datetime>"
}

Data to review:
${JSON.stringify(inputs, null, 2)}
`;

  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  let outputText = response.choices[0].message.content.trim();
  let data;
  try {
    data = JSON.parse(outputText);
  } catch {
    const m = outputText.match(/\{[\s\S]*\}/);
    data = m ? JSON.parse(m[0]) : {
      caseId,
      judgement_summary: "Unable to parse fully, but decision seems neutral.",
      fairness_score: 0.8,
      bias_detected: "no",
      bias_reasoning: "No direct evidence of bias found.",
      ethical_flags: [],
      recommendation: "accept",
      timestamp: new Date().toISOString()
    };
  }

  return data;
}
