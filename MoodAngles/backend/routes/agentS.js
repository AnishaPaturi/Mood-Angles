// backend/routes/agentS.js
import express from "express";
import { runAgentS } from "../agents/agentS.js";
import SafetyRecord from "../models/SafetyRecord.js";

const router = express.Router();

router.post("/angelS/analyze", async (req, res) => {
  try {
    const { userId, text } = req.body;
    if (!text) return res.status(400).json({ ok: false, error: "Missing text input" });

    const result = await runAgentS({ userId, text });
    await SafetyRecord.create({ userId, text, ...result });

    // If high or critical risk, trigger alert (for later real integration)
    if (["high", "critical"].includes(result.risk_level)) {
      console.log(`🚨 ALERT: User ${userId || "unknown"} at ${result.risk_level.toUpperCase()} risk!`);
    }

    res.json({ ok: true, safety_analysis: result });
  } catch (err) {
    console.error("Angel S Error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
