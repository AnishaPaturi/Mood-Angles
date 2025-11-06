// backend/routes/agentD.js
import express from "express";
import { runAgentD } from "../agents/agentD.js";
import ScaleResponse from "../models/ScaleResponse.js";
import MedicalRecord from "../models/MedicalRecord.js";

const router = express.Router();

/**
 * POST /api/angelD/report
 * Body may contain:
 *  - userId
 *  - agentR_result (optional)  // if you already have it
 *  - scaleData (optional)      // direct scale input to re-run agentR-like summary (optional)
 *  - medicalRecord, family_history, treatment_history, narrative, retrieved_cases
 *
 * If agentR_result is not provided, the route will attempt to pull scale + narrative from DB
 * and call Angel.R (if you have that endpoint) prior to Agent.D. For simplicity we accept agentR_result.
 */
router.post("/angelD/report", async (req, res) => {
  try {
    const {
      userId,
      agentR_result,
      scaleData,
      medicalRecord,
      family_history,
      treatment_history,
      narrative,
      retrieved_cases
    } = req.body;

    // If user did not provide agentR_result, attempt to fetch user's medicalRecord from DB
    let med = medicalRecord;
    if (!med && userId) {
      const medDoc = await MedicalRecord.findOne({ userId });
      med = medDoc?.narrative || "";
    }

    // Run Agent D
    const result = await runAgentD({
      userId,
      agentR_result: agentR_result || {},
      medicalRecord: med || "",
      family_history: family_history || "",
      treatment_history: treatment_history || "",
      narrative: narrative || "",
      retrieved_cases: retrieved_cases || []
    });

    res.json({ ok: true, diagnosis_report: result });
  } catch (err) {
    console.error("agentD/report error:", err);
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

export default router;
