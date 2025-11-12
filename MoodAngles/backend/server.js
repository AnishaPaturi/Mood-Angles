import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { spawn } from "child_process";

// ✅ Import routes
import authRoutes from "./routes/authRoutes.js";
import profileRoute from "./routes/profileRoute.js";
import resultsRoute from "./routes/results.js";
import uploadRoute from "./routes/uploadRoute.js";
import otpRoutes from "./routes/otpRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";



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
app.use("/api/feedback", feedbackRoutes);

// app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoute);
app.use("/api/uploads", uploadRoute); // ✅ Correct endpoint
app.use("/uploads", express.static("uploads")); // to serve static files
app.use("/api/results", resultsRoute);
app.use("/api", otpRoutes);
app.use("/api/uploads", uploadRoute); // ✅ Your uploads route
app.use("/uploads", express.static("uploads")); // ✅ Serve static files
app.use("/api/invite", inviteRoutes);

// ✅ Python Agents (keep as is)
app.post("/api/angelR", (req, res) => {
  const PY =
    process.env.PYTHON_PATH ||
    (process.platform === "win32" ? "python" : "python3");
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
    return res
      .status(500)
      .json({ error: "agent_r_spawn_error", details: String(err) });
  });

  try {
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();
  } catch (e) {
    console.error("⚠️ Failed to write to Agent R stdin:", e);
    try {
      py.kill();
    } catch {}
    return res
      .status(500)
      .json({ error: "agent_r_stdin_error", details: String(e) });
  }

  py.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  py.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  const timeLimit = Number(process.env.AGENT_PY_TIMEOUT_MS || 15000);
  const killTimeout = setTimeout(() => {
    killedByTimeout = true;
    try {
      py.kill("SIGKILL");
    } catch (e) {
      console.error("Error killing agentR:", e);
    }
  }, timeLimit);

  py.on("close", (code, signal) => {
    clearTimeout(killTimeout);
    if (killedByTimeout)
      return res
        .status(500)
        .json({ error: "agent_r_timed_out", stdout, stderr });
    if (code !== 0)
      return res.status(500).json({
        error: "agent_r_failed",
        code,
        signal,
        stderr,
        stdout,
      });

    try {
      const parsed = JSON.parse(stdout.trim());
      return res.json(parsed);
    } catch (err) {
      console.error("❌ Could not JSON.parse agentR stdout:", stdout, "err:", err);
      return res
        .status(500)
        .json({ error: "agent_r_invalid_response", stdout, stderr });
    }
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));