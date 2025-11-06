// backend/routes/agentC.js
import express from "express";
import { runAgentC } from "../agents/agentC.js";
const router = express.Router();

router.post("/angelC/chat", async (req, res) => {
  try {
    const { userId, message, context } = req.body;
    if (!message) return res.status(400).json({ ok: false, error: "Missing message" });

    const result = await runAgentC({ userId, message, context });
    res.json({ ok: true, response: result });
  } catch (err) {
    console.error("angelC/chat error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
