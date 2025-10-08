import express from "express";
import { spawn } from "child_process";

const router = express.Router();

router.get("/diagnose/test/:index", async (req, res) => {
  console.log("🧠 Running predict.py ...");

  const py = spawn(
    "C:\\Users\\Anisha Paturi\\AppData\\Local\\Programs\\Python\\Python311\\python.exe",
    ["./ml/predict.py"],
    { cwd: process.cwd() }
  );

  let output = "";
  let errorOutput = "";

  py.stdout.on("data", (data) => {
    console.log("🐍 stdout:", data.toString()); // 👈 log everything from Python
    output += data.toString();
  });

  py.stderr.on("data", (data) => {
    console.error("🐍 stderr:", data.toString()); // 👈 log Python errors
    errorOutput += data.toString();
  });

  py.on("close", (code) => {
    console.log(`🐍 Python exited with code ${code}`);

    if (errorOutput) {
      return res.status(500).json({ error: errorOutput });
    }

    try {
      const lines = output.trim().split("\n");
      const last = lines[lines.length - 1];
      const parsed = JSON.parse(last);
      res.json({ success: true, data: parsed });
    } catch (err) {
      console.error("❌ JSON parse error:", err, "raw output:", output);
      res.status(500).json({ error: "Failed to parse Python output", raw: output });
    }
  });
});

export default router;
