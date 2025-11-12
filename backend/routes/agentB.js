import express from "express";
import { runAgentB } from "../agents/agentB.js";
import DebateRecord from "../models/DebateRecord.js";

const router = express.Router();

router.post("/angelB/debate", async (req, res) => {
  try {
    const { caseId, agentsData } = req.body;
    const result = await runAgentB({ caseId, agentsData });
    await DebateRecord.create(result);
    res.json({ ok: true, debate: result });
  } catch (err) {
    console.error("Angel B error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
