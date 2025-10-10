// backend/routes/agentE.js
import express from "express";
import { runAgentE } from "../agents/agentE.js";
import EmotionRecord from "../models/EmotionRecord.js";

const router = express.Router();

router.post("/angelE/analyze", async (req, res) => {
  try {
    const { userId, text } = req.body;
    if (!text) return res.status(400).json({ ok: false, error: "Missing text input" });

    const result = await runAgentE({ userId, text });
    await EmotionRecord.create(result);
    res.json({ ok: true, emotion_analysis: result });
  } catch (err) {
    console.error("Angel E error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
