import express from "express";
import { runAgentJ } from "../agents/agentJ.js";
import JudgementRecord from "../models/JudgementRecord.js";

const router = express.Router();

router.post("/angelJ/judge", async (req, res) => {
  try {
    const { caseId, inputs } = req.body;
    const result = await runAgentJ({ caseId, inputs });
    await JudgementRecord.create(result);
    res.json({ ok: true, judgement: result });
  } catch (err) {
    console.error("Angel J error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
