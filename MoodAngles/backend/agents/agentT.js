// backend/agents/agentT.js
import OpenAI from "openai";
import dotenv from "dotenv";
import DiagnosisReport from "../models/DiagnosisReport.js";
import ScaleResponse from "../models/ScaleResponse.js";
import mongoose from "mongoose";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function runAgentT({ userId }) {
  if (!userId) throw new Error("Missing userId");

  // Fetch historical data
  const reports = await DiagnosisReport.find({ userId }).sort({ createdAt: 1 });
  const scales = await ScaleResponse.find({ userId }).sort({ createdAt: 1 });

  if (!reports.length && !scales.length) {
    return {
      summary: "No prior diagnostic or scale data found.",
      next_action: "collect_data",
    };
  }

  // Build a concise timeline for the LLM
  const timeline = reports
    .map(
      (r, i) =>
        `Report ${i + 1} (${new Date(r.createdAt).toLocaleDateString()}): risk=${r.risk_level}, confidence=${r.confidence}, impression=${r.impression}`
    )
    .join("\n");

  const latest = reports[reports.length - 1];

  const prompt = `
You are Angel.T, a digital mental-health treatment-tracking assistant.
Analyze this patient's mood progression and produce a structured follow-up summary.

Timeline:
${timeline || "No prior reports"}

Latest report summary:
${latest?.summary || "N/A"}

Return **strict JSON**:
{
  "progress": "<improved|stable|worsened|no_data>",
  "summary": "<short summary of mood trend>",
  "risk_change": "<increased|decreased|same>",
  "recommendations": ["<3 concrete next steps>"],
  "followup_interval_days": <integer>,
  "flag": "<none|review_needed|urgent>"
}
`;

  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const text = response.choices[0].message.content;
  let parsed;
  try {
    parsed = JSON.parse(text.trim());
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : {
      progress: "stable",
      summary: text.slice(0, 300),
      risk_change: "same",
      recommendations: ["Continue monitoring", "Maintain therapy", "Check again in 1 week"],
      followup_interval_days: 7,
      flag: "none",
    };
  }

  // Store follow-up record
  const TreatmentRecord = mongoose.models.TreatmentRecord;
  if (TreatmentRecord) {
    await TreatmentRecord.create({
      userId,
      ...parsed,
      createdAt: new Date(),
    });
  }

  return parsed;
}
