// backend/routes/results.js
import express from "express";
import TestResult from "../models/TestResult.js";

const router = express.Router();

// If you have auth middleware that attaches req.user, import it and add it to the route.
// import { requireAuth } from "../middleware/auth.js";

router.post("/", /* requireAuth, */ async (req, res) => {
  try {
    const {
      testType,
      score,
      level,
      answers,
      agentR_result,
      agentD_result,
      agentC_result,
      agentE_result,
      agentJ_result,
      meta,
    } = req.body;

    if (!testType || score === undefined || level === undefined) {
      return res.status(400).json({ error: "missing_fields", details: "testType, score, level required" });
    }

    const doc = new TestResult({
      user: req.user?.id || null,
      testType,
      score,
      level,
      answers: answers || null,
      agents: {
        agentR: agentR_result || null,
        agentD: agentD_result || null,
        agentC: agentC_result || null,
        agentE: agentE_result || null,
        agentJ: agentJ_result || null,
      },
      meta:
        meta ||
        {
          ip: req.ip,
          userAgent: req.get("User-Agent"),
          submittedAt: new Date(),
        },
    });

    await doc.save();
    return res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error("Error saving test result:", err);
    return res.status(500).json({ error: "internal_server_error", details: err.message });
  }
});

export default router;
