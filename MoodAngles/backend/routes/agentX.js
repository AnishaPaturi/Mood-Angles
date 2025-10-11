// backend/routes/agentX.js
import express from "express";
import { runAgentX } from "../agents/agentX.js";
import ExplainabilityRecord from "../models/ExplainabilityRecord.js";

const router = express.Router();

router.post("/angelX/explain", async (req, res) => {
  try {
    const { userId, diagnosis, scaleData, modelConfidence } = req.body;
    if (!diagnosis) return res.status(400).json({ ok: false, error: "Missing diagnosis" });

    const result = await runAgentX({ userId, diagnosis, scaleData, modelConfidence });
    await ExplainabilityRecord.create(result);
    res.json({ ok: true, explanation: result });
  } catch (err) {
    console.error("Angel X error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
