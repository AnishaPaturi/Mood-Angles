import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { spawn } from "child_process";

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

// ✅ Initialize app
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Import routes (make sure files exist in ./routes/)
import authRoutes from "./routes/authRoutes.js";
import profileRoute from "./routes/profileRoute.js";

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoute);

// ✅ Python Agents (keep your existing agent logic here)
// Example one shown below for brevity — keep the rest same
app.post("/api/angelR", (req, res) => {
  const PY = process.env.PYTHON_PATH || (process.platform === "win32" ? "python" : "python3");
  const script = path.join(process.cwd(), "agentR.py");

  let stdout = "";
  let stderr = "";
  let killedByTimeout = false;

  const py = spawn(PY, [script], {
    env: { ...process.env },
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  py.on("error", (err) => {
    console.error("⚠️ spawn error for agentR:", err);
    return res.status(500).json({ error: "agent_r_spawn_error", details: String(err) });
  });

  try {
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();
  } catch (e) {
    console.error("⚠️ Failed to write to Agent R stdin:", e);
    try { py.kill(); } catch {}
    return res.status(500).json({ error: "agent_r_stdin_error", details: String(e) });
  }

  py.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
  py.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

  const timeLimit = Number(process.env.AGENT_PY_TIMEOUT_MS || 15000);
  const killTimeout = setTimeout(() => {
    killedByTimeout = true;
    try { py.kill("SIGKILL"); } catch (e) { console.error("Error killing agentR:", e); }
  }, timeLimit);

  py.on("close", (code, signal) => {
    clearTimeout(killTimeout);
    if (killedByTimeout)
      return res.status(500).json({ error: "agent_r_timed_out", stdout, stderr });
    if (code !== 0)
      return res.status(500).json({ error: "agent_r_failed", code, signal, stderr, stdout });

    try {
      const parsed = JSON.parse(stdout.trim());
      return res.json(parsed);
    } catch (err) {
      console.error("❌ Could not JSON.parse agentR stdout:", stdout, "err:", err);
      return res.status(500).json({ error: "agent_r_invalid_response", stdout, stderr });
    }
  });
});

// ✅ Static uploads
app.use("/uploads", express.static("uploads"));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
