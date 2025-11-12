// backend/agents/agentD.js
import OpenAI from "openai";
import dotenv from "dotenv";
import DiagnosisReport from "../models/DiagnosisReport.js";
dotenv.config();

// Ensure OPENAI_API_KEY is set in .env
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * runAgentD
 * Inputs:
 *  - payload: {
 *      userId,
 *      agentR_result: { probability, label, reasoning },
 *      medicalRecord,
 *      family_history,
 *      treatment_history,
 *      narrative,
 *      retrieved_cases // optional: array of retrieved cases (for Angel.D)
 *    }
 *
 * Output: saved DiagnosisReport document (as plain object)
 */
export async function runAgentD(payload = {}) {
  const {
    userId = "unknown",
    agentR_result = {},
    medicalRecord = "",
    family_history = "",
    treatment_history = "",
    narrative = "",
    retrieved_cases = [],
  } = payload;

  // Build a compact, clear prompt for Angel.D (DSM-5 style diagnostic summary)
  const prompt = `
You are Angel.D, a psychiatry diagnostic expert. You are given an initial diagnostic opinion from Angel.R and optional similar case references. Use DSM-5 style reasoning and produce a structured diagnostic report.

Patient ID: ${userId}

Angel.R result:
- probability: ${agentR_result.probability ?? "N/A"}
- label: ${agentR_result.label ?? "N/A"}  (1=has mood disorder, 0=no)
- reasoning: ${agentR_result.reasoning ?? "N/A"}

Medical record (short): ${medicalRecord || "N/A"}
Family history: ${family_history || "N/A"}
Treatment history: ${treatment_history || "N/A"}
Narrative: ${narrative || "N/A"}

${retrieved_cases.length ? `Top ${retrieved_cases.length} retrieved similar cases (for reference):\n${retrieved_cases.map((c,i)=>`CASE ${i+1}: ${c?.summary || JSON.stringify(c).slice(0,200)}`).join("\n")}\n` : ""}

TASK:
Produce a JSON object ONLY (no extra explanatory text) with these keys:
{
  "summary": "<brief DSM-style diagnostic summary (1-3 short paragraphs)>",
  "impression": "<short impression e.g. 'No mood disorder', 'Mild depressive episode', 'Probable bipolar disorder'>",
  "risk_level": "<Low|Moderate|High>",
  "confidence": <number 0.0-1.0>,               // your calibrated confidence (use agentR probability as anchor)
  "recommendations": ["<list of 3 concise recommendations>"],
  "rationale": "<bullet-summary of the main reasons referencing scales or record>",
  "references": ["<short citations or DSM criteria used>"]
}

Use clinical tone. Anchor 'confidence' to agentR_result.probability if available (e.g., slight adjustment).
If retrieved_cases are provided, factor them in but do not over-rely on them—mention them in the rationale.
Return parsable JSON only.
`;

  // Call the LLM
  // Note: your project used gpt-4o-mini earlier — uses env variable LLM_MODEL to choose
  const modelName = process.env.LLM_MODEL || "gpt-4o-mini";

  try {
    const resp = await client.chat.completions.create({
      model: modelName,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 600,
    });

    // SDKs vary in shape; handle common shapes
    const llmText =
      (resp?.choices?.[0]?.message?.content) ||
      resp?.choices?.[0]?.text ||
      resp?.output?.[0]?.content?.[0]?.text ||
      "";

    // Attempt to parse JSON response
    let parsed;
    try {
      parsed = JSON.parse(llmText.trim());
    } catch (err) {
      // Try to extract JSON substring
      const m = llmText.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
      else {
        // Fallback: wrap in minimal structure
        parsed = {
          summary: llmText.trim().slice(0, 800),
          impression: agentR_result.label ? "Possible mood disorder" : "No mood disorder",
          risk_level: agentR_result.probability >= 0.75 ? "High" : agentR_result.probability >= 0.4 ? "Moderate" : "Low",
          confidence: agentR_result.probability ?? 0.5,
          recommendations: [
            "Clinical follow-up within 2 weeks",
            "Monitor sleep, appetite, and suicidal ideation",
            "Consider referral to psychiatry if symptoms persist"
          ],
          rationale: agentR_result.reasoning || "ML + symptom review",
          references: ["DSM-5 mood disorders criteria"]
        };
      }
    }

    // Validate and normalize fields
    const report = {
      userId,
      agent: "Angel.D",
      summary: String(parsed.summary || "").trim(),
      impression: String(parsed.impression || parsed.impression === 0 ? parsed.impression : (parsed.impression || (agentR_result.label ? "Possible mood disorder" : "No mood disorder"))),
      risk_level: String(parsed.risk_level || "Low"),
      confidence: Number(parsed.confidence ?? agentR_result.probability ?? 0.5),
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 6) : (parsed.recommendations ? [parsed.recommendations] : []),
      rationale: String(parsed.rationale || agentR_result.reasoning || "").trim(),
      references: Array.isArray(parsed.references) ? parsed.references : (parsed.references ? [parsed.references] : ["DSM-5 criteria"]),
      rawLLMResponse: llmText,
      createdAt: new Date(),
    };

    // Save to DB (if model available)
    try {
      const saved = await DiagnosisReport.create(report);
      return saved.toObject();
    } catch (dbErr) {
      // If DB save fails, still return report object
      console.error("AgentD: DB save failed:", dbErr?.message || dbErr);
      return report;
    }
  } catch (err) {
    console.error("AgentD LLM error:", err?.message || err);
    throw err;
  }
}
