// backend/agents/agentM.js
import mongoose from "mongoose";
import MonitoringRecord from "../models/MonitoringRecord.js";

export async function runAgentM({
  agent,
  userId,
  input,
  output,
  latencyMs,
  confidence,
  error = null,
}) {
  try {
    const record = await MonitoringRecord.create({
      agent,
      userId,
      input,
      output,
      latencyMs,
      confidence,
      error,
      timestamp: new Date(),
    });

    // Quick health insights
    let status = "ok";
    if (error) status = "error";
    else if (confidence && confidence < 0.4) status = "low_confidence";
    else if (latencyMs > 3000) status = "slow_response";

    return { ok: true, status, record };
  } catch (err) {
    console.error("Agent M error:", err);
    return { ok: false, error: err.message };
  }
}
