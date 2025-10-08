import express from "express";
import { runAgentR } from "../agents/agentR.js";
import ScaleResponse from "../models/ScaleResponse.js";
import MedicalRecord from "../models/MedicalRecord.js";

const router = express.Router();

router.post("/angelR/diagnose", async (req, res) => {
  try {
    const { userId, scaleData, medicalRecord } = req.body;

    if (!scaleData) {
      return res.status(400).json({ error: "Missing scaleData" });
    }

    const result = await runAgentR({ userId, scaleData, medicalRecord });
    res.json({ ok: true, diagnosis: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
