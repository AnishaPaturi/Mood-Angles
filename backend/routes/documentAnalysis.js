// backend/routes/documentAnalysis.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import MedicalRecord from "../models/MedicalRecord.js";

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

// Run agent pipeline on extracted text with smart triage
const runAgentPipeline = async (text, category, testName = "Document Analysis") => {
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

  // Normalize category to match agentMap keys
  const normalizedCategory = category.toLowerCase().replace(/\s/g, '_');
  // Define agent routing based on category
  const agentMap = {
    prescription: ["agentJ"],
    lab_report: ["agentR", "agentD"],
    psych_letter: ["agentR", "agentC"],
    insurance: ["agentJ"],
    other: ["agentJ"]
  };
  const agentsToRun = agentMap[normalizedCategory] || ["agentJ"];
   
  // Run specified agents
  for (const agent of agentsToRun) {
    try {
      let res;
      switch (agent) {
        case "agentR":
          res = await fetch(`${API_BASE}/api/angelR`, {
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
          results.agentR = await res.json();
          break;
        case "agentJ":
          res = await fetch(`${API_BASE}/api/angelJ`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              condition: testName,
              testName,
              extractedText: text,
            }),
          });
          results.agentJ = await res.json();
          break;
        case "agentD":
          res = await fetch(`${API_BASE}/api/angelD`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              condition: testName,
              testName,
              extractedText: text,
            }),
          });
          results.agentD = await res.json();
          break;
        case "agentC":
          // Agent C will be run later as a fusion layer
          break;
      }
    } catch (error) {
      console.error(`Error running ${agent}:`, error);
      // Set default error response based on agent type
      if (agent === "agentR") {
        results.agentR = { result: "Analysis unavailable" };
      } else if (agent === "agentJ") {
        results.agentJ = { decision: "Unknown", urgency: "medium" };
      } else if (agent === "agentD") {
        results.agentD = { result: "Analysis unavailable" };
      }
    }
  }

  // Run Agent C as fusion layer if we have results from other agents
  if (Object.keys(results).length > 0 && 
      (results.agentR || results.agentJ || results.agentD)) {
    try {
      const fusionRes = await fetch(`${API_BASE}/api/angelC`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: testName,
          testName,
          extractedText: text,
          agentR: results.agentR || null,
          agentJ: results.agentJ || null,
          agentD: results.agentD || null,
        }),
      });
      results.agentC = await fusionRes.json();
    } catch (error) {
      console.error("Error running Agent C (fusion layer):", error);
      results.agentC = { 
        result: "Fusion analysis unavailable",
        confidence_score: 0.0,
        contradiction_check: "failed"
      };
    }
  }

  return results;
};

router.post("/analyze", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const extractedText = await extractText(req.file.path);
      const { category, userId } = req.body;

      // If extraction returned an OCR error marker, return 400 with guidance
      if (extractedText && extractedText.includes("OCR_ERROR:")) {
        return res.status(400).json({
          error: "ocr_missing",
          details: extractedText.replace("OCR_ERROR:", "").trim(),
        });
      }

      const agentResults = await runAgentPipeline(extractedText, category);

      // Save to MedicalRecord if userId is provided
      if (userId) {
        try {
          const medicalRecord = new MedicalRecord({
            userId,
            narrative: extractedText,
            structured: {
              analysis: agentResults,
              filename: req.file.filename,
              originalname: req.file.originalname,
              category
            },
            date: new Date()
          });
          await medicalRecord.save();
          console.log(`Medical record saved for user ${userId}`);
        } catch (saveError) {
          console.error("Failed to save medical record:", saveError);
          // Don't fail the request if medical record saving fails
        }
      }

      res.json({
        message: "Document analyzed successfully",
        file: req.file.filename,
        extractedText,
        analysis: agentResults,
        receivedCategory: category // Debug field
      });
    } catch (err) {
      const msg = err?.message || err || "Unknown extraction error";
      console.error("Document analysis error:", msg);
      res.status(500).json({ error: "extraction_failed", details: msg });
    }
  });

export default router;