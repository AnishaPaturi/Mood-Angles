// backend/routes/documentAnalysis.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

const router = express.Router();
const uploadDir = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Extract text from uploaded document
const extractText = (filePath) => {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [path.join(process.cwd(), "scripts/extract_text.py"), filePath]);
    let output = "";
    let error = "";

    py.stdout.on("data", (data) => output += data.toString());
    py.stderr.on("data", (data) => error += data.toString());
    py.on("close", (code) => {
      if (code !== 0) reject(error);
      else resolve(output);
    });
  });
};

// Run agent pipeline on extracted text
const runAgentPipeline = async (text, testName = "Document Analysis") => {
  const API_BASE = process.env.API_BASE || "http://localhost:5000";
  const results = {};

  // Validate extracted text before sending to agents
  if (!text || text.trim().length < 5) {
    return {
      agentR: { result: "Insufficient text extracted for analysis" },
      agentJ: {
        decision: "Unlikely",
        confidence: 0.0,
        urgency: "low",
        reasoning: "Insufficient text extracted from document to perform analysis.",
        actions: ["Please upload a clearer or more complete document."],
        final_call: "Assessment: Unlikely. Insufficient extracted text.",
      },
    };
  }

  try {
    // Agent R
    const rRes = await fetch(`${API_BASE}/api/angelR`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        condition: testName,
        testName,
        score_percent: 50,
        level: "Analysis",
        answers: {},
        extractedText: text,
      }),
    });
    results.agentR = await rRes.json();
  } catch {
    results.agentR = { result: "Analysis unavailable" };
  }

  try {
    // Agent J
    const jRes = await fetch(`${API_BASE}/api/angelJ`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        condition: testName,
        testName,
        extractedText: text,
      }),
    });
    results.agentJ = await jRes.json();
  } catch {
    results.agentJ = { decision: "Unknown", urgency: "medium" };
  }

  return results;
};

router.post("/analyze", upload.single("file"), async (req, res) => {
   if (!req.file) return res.status(400).json({ error: "No file uploaded" });

   try {
     const extractedText = await extractText(req.file.path);
     const agentResults = await runAgentPipeline(extractedText);

     res.json({
       message: "Document analyzed successfully",
       file: req.file.filename,
       extractedText,
       analysis: agentResults,
     });
   } catch (err) {
     const msg = err?.message || err || "Unknown extraction error";
     console.error("Document analysis error:", msg);
     res.status(500).json({ error: "extraction_failed", details: msg });
   }
 });

export default router;