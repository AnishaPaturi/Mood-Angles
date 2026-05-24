// backend/routes/results.js
import express from "express";
import TestResult from "../models/TestResult.js";

const router = express.Router();

router.post("/", /* requireAuth, */ async (req, res) => {
  try {
    const {
      testType,
      score,
      level,
      attempt = 1,
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

    const userFromBody = req.body.user;

    const doc = new TestResult({
      user: req.user?.id || userFromBody || null,
      testType,
      score,
      level,
      attempt: parseInt(attempt) || 1,
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

router.get("/previous/:testType", async (req, res) => {
  try {
    const { testType } = req.params;
    const { userId, limit = 5 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    // Map frontend category to actual stored test types
    const testTypeMap = {
      adhd: ["ADHD"],
      depression: ["Depression"],
      anxiety: ["Anxiety (GAD)"],
      bipolar: ["Bipolar Test"],
      autism: ["Autism"],
      eq: ["EQ"],
      personality: ["Personality"],
      neuro: ["Neuro"],
      mentalhealth: ["Mental Health Today"]
    };
    
    const validTestTypes = testTypeMap[testType.toLowerCase()] || [testType];
    
    const previousResults = await TestResult.find({
      user: userId,
      testType: { $in: validTestTypes }
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("score level createdAt answers")
      .lean();

    return res.json({ previousResults });
  } catch (err) {
    console.error("Error fetching previous results:", err);
    return res.status(500).json({ error: "internal_server_error", details: err.message });
  }
});

export default router;
