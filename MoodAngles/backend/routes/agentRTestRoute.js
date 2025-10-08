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

  let stdoutData = "";
  let stderrData = "";

  py.stdout.on("data", (data) => {
    const text = data.toString();
    console.log("🐍 stdout:", text);
    stdoutData += text;
  });

  py.stderr.on("data", (data) => {
    const text = data.toString();
    console.error("🐍 stderr:", text);
    stderrData += text;
  });

  py.on("close", (code) => {
    console.log(`🐍 Python exited with code ${code}`);

    if (!stdoutData.trim()) {
      // No JSON output, return stderr logs
      return res.status(500).json({ error: stderrData });
    }

    try {
      // Parse the JSON object from stdout
      const parsed = JSON.parse(stdoutData.trim().split("\n").pop());
      return res.json({ success: true, data: parsed });
    } catch (err) {
      console.error("❌ JSON parse error:", err);
      console.error("Raw stdout:", stdoutData);
      return res
        .status(500)
        .json({ error: "Failed to parse Python output", raw: stdoutData });
    }
  });
});

export default router;
