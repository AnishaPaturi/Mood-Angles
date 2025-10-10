// backend/routes/agentT.js
import express from "express";
import { runAgentT } from "../agents/agentT.js";
const router = express.Router();

router.post("/angelT/followup", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ ok: false, error: "Missing userId" });

    const result = await runAgentT({ userId });
    res.json({ ok: true, followup: result });
  } catch (err) {
    console.error("angelT/followup error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
