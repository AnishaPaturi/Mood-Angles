// agents/agentR.js
import Diagnosis from "../models/Diagnosis.js";
import { spawn } from "child_process";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * 🔹 Run the Python ML predictor
 * Replaces python-shell with child_process.spawn (faster + no hanging)
 */
export function mlPredict(scaleData) {
  return new Promise((resolve, reject) => {
    try {
      const py = spawn("python", ["ml/predict.py", JSON.stringify(scaleData)]);

      let dataBuffer = "";
      let errorBuffer = "";

      py.stdout.on("data", (chunk) => {
        dataBuffer += chunk.toString();
      });

      py.stderr.on("data", (chunk) => {
        errorBuffer += chunk.toString();
      });

      py.on("close", (code) => {
        if (code !== 0) {
          console.error("❌ Python exited with code", code);
          console.error("stderr:", errorBuffer);
          return reject(new Error(errorBuffer || "Python process failed"));
        }

        try {
          const parsed = JSON.parse(dataBuffer.trim());
          resolve(parsed);
        } catch (e) {
          console.error("❌ Failed to parse Python output:", dataBuffer);
          reject(e);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 🔹 Convert numeric scale data into readable text for LLM context
 */
function scaleResponsesToText(scaleData) {
  return Object.entries(scaleData)
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
    .join("; ");
}

/**
 * 🔹 Main Angel.R diagnostic function
 */
export async function runAgentR({ userId, medicalRecord = "", scaleData = {} }) {
  if (!scaleData || Object.keys(scaleData).length === 0) {
    throw new Error("❌ No scaleData supplied");
  }

  // 1️⃣  Run ML classifier
  const mlRes = await mlPredict(scaleData).catch((e) => {
    throw new Error("ML prediction failed: " + e.message);
  });

  const mlProb = Number(mlRes.probability ?? 0);
  const mlLabel = Boolean(mlRes.label);

  // 2️⃣  Prepare LLM reasoning prompt
  const scaleText = scaleResponsesToText(scaleData);
  const prompt = `
You are Angel.R, an AI psychiatry diagnostic assistant using DSM-5 criteria.

Context:
- ML classifier probability of mood disorder: ${(mlProb * 100).toFixed(1)}%
- Medical record: ${medicalRecord || "N/A"}
- Scale responses: ${scaleText}

Task:
Determine whether the patient has a mood disorder (e.g., major depression or bipolar).
Respond ONLY in pure JSON with exactly these keys:
{
  "hasMoodDisorder": true|false,
  "confidence": 0.00-1.00,
  "reasoning": "1-3 concise sentences explaining the judgment"
}
`;

  // 3️⃣  Call OpenAI model
  const completion = await openai.chat.completions.create({
    model: process.env.LLM_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400
  });

  const llmText =
    completion?.choices?.[0]?.message?.content ||
    completion?.choices?.[0]?.text ||
    "";

  // 4️⃣  Parse LLM JSON safely
  let parsed;
  try {
    parsed = JSON.parse(llmText.trim());
  } catch {
    const match = llmText.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
    else throw new Error("LLM did not return valid JSON: " + llmText.slice(0, 200));
  }

  // 5️⃣  Combine results
  const result = {
    userId,
    agent: "Angel.R",
    hasMoodDisorder:
      typeof parsed.hasMoodDisorder === "boolean"
        ? parsed.hasMoodDisorder
        : mlLabel,
    confidence: Number(parsed.confidence) || mlProb,
    reasoning: parsed.reasoning || "Reasoning not provided by LLM.",
    rawLLMResponse: parsed,
    mlProbability: mlProb
  };

  // 6️⃣  Store in MongoDB
  const saved = await Diagnosis.create(result);
  return saved.toObject();
}
