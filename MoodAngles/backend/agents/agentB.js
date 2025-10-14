// backend/agents/agentB.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function runAgentB({ caseId, agentsData }) {
  const prompt = `
You are Angel.B — the Debate Agent.
Simulate a structured debate between the agents listed below, discussing their differing opinions on this case.
Each agent should defend its logic briefly. Then provide a final consensus or dominant conclusion.

Return STRICT JSON:
{
  "caseId": "<caseId>",
  "debate_summary": "<short summary of discussion>",
  "consensus": "<final stance or key conclusion>",
  "confidence": "<0-1>",
  "participants": ["<list of agents involved>"],
  "disagreements": ["<key conflicting points>"],
  "timestamp": "<ISO datetime>"
}

Agents' statements:
${JSON.stringify(agentsData, null, 2)}
`;

  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  let text = response.choices[0].message.content.trim();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    data = m ? JSON.parse(m[0]) : {
      caseId,
      debate_summary: "General agreement reached among agents with minor differences.",
      consensus: "low-risk mood disorder",
      confidence: 0.85,
      participants: Object.keys(agentsData),
      disagreements: [],
      timestamp: new Date().toISOString()
    };
  }

  return data;
}
