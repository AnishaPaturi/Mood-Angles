import express from "express";
import { runAgentR } from "../agents/agentR.js";
import ScaleResponse from "../models/ScaleResponse.js";
import MedicalRecord from "../models/MedicalRecord.js";

const router = express.Router();

router.post("/diagnose/angelR", async (req, res) => {
  try {
    const { userId } = req.body;
    const record = await MedicalRecord.findOne({ userId });
    const scales = await ScaleResponse.findOne({ userId });
    if (!scales) return res.status(400).json({ error: "No scale data found" });

    const result = await runAgentR({
      userId,
      medicalRecord: record?.narrative,
      scaleData: scales.responses
    });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;