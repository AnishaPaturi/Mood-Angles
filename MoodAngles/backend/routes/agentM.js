// backend/routes/agentM.js
import express from "express";
import { runAgentM } from "../agents/agentM.js";
import MonitoringRecord from "../models/MonitoringRecord.js";

const router = express.Router();

router.post("/angelM/log", async (req, res) => {
  try {
    const { agent, userId, input, output, latencyMs, confidence, error } = req.body;

    // Ensure at least one required field
    if (!agent) return res.status(400).json({ ok: false, error: "Missing 'agent' name" });

    const result = await runAgentM({
      agent,
      userId,
      input,
      output,
      latencyMs,
      confidence,
      error,
    });

    return res.json(result);
  } catch (err) {
    console.error("❌ /angelM/log error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/angelM/stats", async (req, res) => {
  try {
    const total = await MonitoringRecord.countDocuments();
    const errors = await MonitoringRecord.countDocuments({ error: { $ne: null } });
    const lowConfidence = await MonitoringRecord.countDocuments({
      confidence: { $lt: 0.4 },
    });
    const avgLatencyResult = await MonitoringRecord.aggregate([
      { $group: { _id: null, avgLatency: { $avg: "$latencyMs" } } },
    ]);

    const avgLatency = avgLatencyResult[0]?.avgLatency || 0;

    return res.json({
      ok: true,
      metrics: { total, errors, lowConfidence, avgLatency },
    });
  } catch (err) {
    console.error("❌ /angelM/stats error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
