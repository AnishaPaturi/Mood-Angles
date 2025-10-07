import OpenAI from "openai";
import dotenv from "dotenv";
import { PythonShell } from "python-shell";
import Diagnosis from "../models/Diagnosis.js";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function predictMoodWithML(scaleData) {
  return new Promise((resolve, reject) => {
    PythonShell.run("ml/predict.py", { args: [JSON.stringify(scaleData)] },
      (err, results) => err ? reject(err) : resolve(JSON.parse(results[0]))
    );
  });
}

export async function runAgentR({ medicalRecord, scaleData, userId }) {
  const ml = await predictMoodWithML(scaleData);
  const prob = (ml.probability * 100).toFixed(1);

  const scaleSummary = Object.entries(scaleData)
    .map(([k, v]) => `${k}: ${v}`).join(", ");

  const prompt = `
You are Angel.R, a psychiatry diagnostic AI using DSM-5 mood-disorder criteria.
An ML classifier gives ${prob}% probability of mood disorder.
Review the data and decide if the client meets DSM-5 criteria.

Medical Record: ${medicalRecord || "N/A"}
Scale Responses: ${scaleSummary}

Output JSON:
{
  "hasMoodDisorder": true/false,
  "confidence": ${ml.probability},
  "reasoning": "short clinical explanation"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  const result = JSON.parse(response.choices[0].message.content);
  await Diagnosis.create({ userId, ...result });
  return result;
}