// routes/agentR.js
import express from "express";
import ScaleResponse from "../models/ScaleResponse.js";
import MedicalRecord from "../models/MedicalRecord.js";
import { runAgentR } from "../agents/agentR.js";

const router = express.Router();

/**
 * POST /api/angelR/diagnose
 * Run the Angel.R diagnostic agent on a user's data.
 */
router.post("/angelR/diagnose", async (req, res) => {
  try {
    const { userId, scaleData: bodyScaleData, medicalRecord: bodyRecord } = req.body || {};

    if (!userId) {
      return res.status(400).json({ ok: false, error: "Missing userId in request body." });
    }

    // 1️⃣ Prefer scale data from request, else fetch from DB
    let scaleDoc;
    if (bodyScaleData && Object.keys(bodyScaleData).length > 0) {
      scaleDoc = { responses: bodyScaleData };
    } else {
      scaleDoc = await ScaleResponse.findOne({ userId });
    }

    if (!scaleDoc || !scaleDoc.responses) {
      return res.status(400).json({
        ok: false,
        error: "No scale data found. Provide 'scaleData' in body or insert a ScaleResponse in the database."
      });
    }

    // 2️⃣ Medical record: from body or DB
    let medicalRecord = "";
    if (bodyRecord) {
      medicalRecord = bodyRecord;
    } else {
      const medDoc = await MedicalRecord.findOne({ userId });
      medicalRecord = medDoc?.narrative || "";
    }

    // 3️⃣ Run the Angel.R agent
    const result = await runAgentR({
      userId,
      medicalRecord,
      scaleData: scaleDoc.responses
    });

    // 4️⃣ Respond with structured result
    return res.status(200).json({
      ok: true,
      message: "Diagnosis generated successfully.",
      diagnosis: result
    });
  } catch (err) {
    console.error("❌ Error in /angelR/diagnose:", err);
    return res.status(500).json({
      ok: false,
      error: err.message || "Internal Server Error"
    });
  }
});

export default router;
