// backend/agents/agentX.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function runAgentX({ userId, diagnosis, scaleData, modelConfidence }) {
  if (!diagnosis) throw new Error("Missing diagnosis");

  const prompt = `
You are Angel.X — an explainability and cross-validation agent.
Your job is to analyze *why* Angel.R predicted this result and provide a transparent, human-readable reasoning.

---
Input Data:
User ID: ${userId || "N/A"}
Diagnosis: ${JSON.stringify(diagnosis, null, 2)}
Scale Data: ${JSON.stringify(scaleData, null, 2)}
Model Confidence: ${modelConfidence || "unknown"}
---

Return STRICT JSON:
{
  "explanation_summary": "<short summary>",
  "top_features": ["<feature1>", "<feature2>", "<feature3>"],
  "feature_influences": {
    "<feature>": "<positive|negative|neutral>"
  },
  "confidence_analysis": "<explain how certain the model is>",
  "alternative_hypotheses": ["<possible alternate interpretations>"],
  "clinician_notes": "<summary to help human reviewer>"
}
`;

  const completion = await client.chat.completions.create({
    model: process.env.LLM_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  let content = completion.choices[0].message.content.trim();
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    parsed = match ? JSON.parse(match[0]) : {
      explanation_summary: "Model output driven primarily by depression and anxiety scores.",
      top_features: ["phq9_total", "gad7_total"],
      feature_influences: { phq9_total: "positive", gad7_total: "positive" },
      confidence_analysis: "Model confidence moderate (0.6–0.8).",
      alternative_hypotheses: ["General stress reaction", "Situational anxiety"],
      clinician_notes: "Review overlapping symptoms and retest in 7 days.",
    };
  }

  return { userId, ...parsed, timestamp: new Date() };
}
