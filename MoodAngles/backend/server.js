import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { spawn } from "child_process";
import connectDB from "./config/db.js";

// ✅ Import routes
import authRoutes from "./routes/authRoutes.js";
import profileRoute from "./routes/profileRoute.js";
import resultsRoute from "./routes/results.js";
import uploadRoute from "./routes/uploadRoute.js";
import otpRoutes from "./routes/otpRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";



// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

// ✅ Initialize app
const app = express();

// ✅ Middleware
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
app.use("/api/results", resultsRoute);
app.use("/api", otpRoutes);
app.use("/api/uploads", uploadRoute); // ✅ Your uploads route
app.use("/uploads", express.static("uploads")); // ✅ Serve static files
app.use("/api/invite", inviteRoutes);

// =====================================================
// =============== AGENT R INTEGRATION =================
// =====================================================
app.post("/api/angelR", (req, res) => {
  const PY = process.env.PYTHON_PATH || (process.platform === "win32" ? "python" : "python3");
  const script = path.join(process.cwd(), "agentR.py");

  let stdout = "", stderr = "", killedByTimeout = false;

  const py = spawn(PY, [script], {
    env: { ...process.env },
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  py.on("error", (err) => {
    console.error("⚠ spawn error for agentR:", err);
    return res.status(500).json({ error: "agent_r_spawn_error", details: String(err) });
  });

  try {
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();
  } catch (e) {
    console.error("⚠ Failed to write to Agent R stdin:", e);
    try { py.kill(); } catch {}
    return res.status(500).json({ error: "agent_r_stdin_error", details: String(e) });
  }

  py.stdout.on("data", chunk => stdout += chunk.toString());
  py.stderr.on("data", chunk => stderr += chunk.toString());

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

// =====================================================
// =============== AGENT D INTEGRATION =================
// =====================================================
app.post("/api/angelD", (req, res) => {
  const PY = process.env.PYTHON_PATH || (process.platform === "win32" ? "python" : "python3");
  const script = path.join(process.cwd(), "agentD.py");

  let stdout = "", stderr = "", killedByTimeout = false;

  const py = spawn(PY, [script], {
    env: { ...process.env },
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  py.on("error", (err) => {
    console.error("⚠ spawn error for Agent D:", err);
    return res.status(500).json({ error: "agent_d_spawn_error", details: String(err) });
  });

  try {
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();
  } catch (e) {
    console.error("⚠ Failed to write to Agent D stdin:", e);
    try { py.kill(); } catch {}
    return res.status(500).json({ error: "agent_d_stdin_error", details: String(e) });
  }

  py.stdout.on("data", chunk => stdout += chunk.toString());
  py.stderr.on("data", chunk => stderr += chunk.toString());

  const timeLimit = Number(process.env.AGENT_PY_TIMEOUT_MS || 15000);
  const killTimeout = setTimeout(() => {
    killedByTimeout = true;
    try { py.kill("SIGKILL"); } catch (e) { console.error("Error killing Agent D:", e); }
  }, timeLimit);

  py.on("close", (code, signal) => {
    clearTimeout(killTimeout);
    if (killedByTimeout)
      return res.status(500).json({ error: "agent_d_timed_out", stdout, stderr });
    if (code !== 0)
      return res.status(500).json({ error: "agent_d_failed", code, signal, stderr, stdout });

    try {
      const parsed = JSON.parse(stdout.trim());
      return res.json(parsed);
    } catch (err) {
      console.error("❌ Could not JSON.parse Agent D stdout:", stdout, "err:", err);
      return res.status(500).json({ error: "agent_d_invalid_response", stdout, stderr });
    }
  });
});

// =====================================================
// =============== AGENT C INTEGRATION =================
// =====================================================
app.post("/api/angelC", (req, res) => {
  const PY = process.env.PYTHON_PATH || (process.platform === "win32" ? "python" : "python3");
  const script = path.join(process.cwd(), "agentC.py");

  let stdout = "", stderr = "", killedByTimeout = false;

  const py = spawn(PY, [script], {
    env: { ...process.env },
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  py.on("error", (err) => {
    console.error("⚠ spawn error for agentC:", err);
    return res.status(500).json({ error: "agent_c_spawn_error", details: String(err) });
  });

  try {
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();
  } catch (e) {
    console.error("⚠ Failed to write to Agent C stdin:", e);
    try { py.kill(); } catch {}
    return res.status(500).json({ error: "agent_c_stdin_error", details: String(e) });
  }

  py.stdout.on("data", chunk => stdout += chunk.toString());
  py.stderr.on("data", chunk => stderr += chunk.toString());

  const timeLimit = Number(process.env.AGENT_PY_TIMEOUT_MS || 60000);
  const killTimeout = setTimeout(() => {
    killedByTimeout = true;
    try { py.kill("SIGKILL"); } catch (e) { console.error("Error killing agentC:", e); }
  }, timeLimit);

  py.on("close", (code, signal) => {
    clearTimeout(killTimeout);

    if (killedByTimeout)
      return res.status(500).json({ error: "agent_c_timed_out", stdout, stderr });
    if (code !== 0)
      return res.status(500).json({ error: "agent_c_failed", code, signal, stderr, stdout });

    try {
      const parsed = JSON.parse(stdout.trim());
      return res.json(parsed);
    } catch (err) {
      console.error("❌ Could not JSON.parse agentC stdout:", stdout, "err:", err);
      return res.status(500).json({ error: "agent_c_invalid_response", stdout, stderr });
    }
  });
});

// =====================================================
// =============== AGENT E INTEGRATION =================
// =====================================================
app.post("/api/angelE", (req, res) => {
  const PY = process.env.PYTHON_PATH || (process.platform === "win32" ? "python" : "python3");
  const script = path.join(process.cwd(), "agentE.py");

  let stdout = "", stderr = "", killedByTimeout = false;

  const py = spawn(PY, [script], {
    env: { ...process.env },
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  py.on("error", err => {
    console.error("⚠ spawn error for agentE:", err);
    return res.status(500).json({ error: "agent_e_spawn_error", details: String(err) });
  });

  try {
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();
  } catch (e) {
    console.error("⚠ Failed to write to Agent E stdin:", e);
    try { py.kill(); } catch {}
    return res.status(500).json({ error: "agent_e_stdin_error", details: String(e) });
  }

  py.stdout.on("data", chunk => stdout += chunk.toString());
  py.stderr.on("data", chunk => stderr += chunk.toString());

  const timeLimit = Number(process.env.AGENT_PY_TIMEOUT_MS || 60000);
  const killTimeout = setTimeout(() => {
    killedByTimeout = true;
    try { py.kill("SIGKILL"); } catch {}
  }, timeLimit);

  py.on("close", (code, signal) => {
    clearTimeout(killTimeout);
    if (killedByTimeout)
      return res.status(500).json({ error: "agent_e_timed_out", stdout, stderr });
    if (code !== 0)
      return res.status(500).json({ error: "agent_e_failed", code, signal, stderr, stdout });

    try {
      const parsed = JSON.parse(stdout.trim());
      return res.json(parsed);
    } catch (err) {
      console.error("❌ Could not JSON.parse Agent E stdout:", stdout);
      return res.status(500).json({ error: "agent_e_invalid_response", stdout, stderr });
    }
  });
});

// =====================================================
// =============== AGENT J INTEGRATION =================
// =====================================================
app.post("/api/angelJ", (req, res) => {
  const PY = process.env.PYTHON_PATH || (process.platform === "win32" ? "python" : "python3");
  const script = path.join(process.cwd(), "agentJ.py");

  let stdout = "", stderr = "", killedByTimeout = false;

  const py = spawn(PY, [script], {
    env: { ...process.env },
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  py.on("error", (err) => {
    console.error("⚠ spawn error for agentJ:", err);
    return res.status(500).json({ error: "agent_j_spawn_error", details: String(err) });
  });

  try {
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();
  } catch (e) {
    console.error("⚠ Failed to write to Agent J stdin:", e);
    try { py.kill(); } catch {}
    return res.status(500).json({ error: "agent_j_stdin_error", details: String(e) });
  }

  py.stdout.on("data", chunk => stdout += chunk.toString());
  py.stderr.on("data", chunk => stderr += chunk.toString());

  const timeLimit = Number(process.env.AGENT_PY_TIMEOUT_MS || 15000);
  const killTimeout = setTimeout(() => {
    killedByTimeout = true;
    try { py.kill("SIGKILL"); } catch (e) { console.error("Error killing agentJ:", e); }
  }, timeLimit);

  py.on("close", (code, signal) => {
    clearTimeout(killTimeout);
    if (killedByTimeout)
      return res.status(500).json({ error: "agent_j_timed_out", stdout, stderr });
    if (code !== 0)
      return res.status(500).json({ error: "agent_j_failed", code, signal, stderr, stdout });

    try {
      const parsed = JSON.parse(stdout.trim());
      return res.json(parsed);
    } catch (err) {
      console.error("❌ Could not JSON.parse agentJ stdout:", stdout, "err:", err, "stderr:", stderr);
      return res.status(500).json({ error: "agent_j_invalid_response", parseError: String(err), stdout, stderr });
    }
  });
});

// =====================================================
// ✅ Start server
// =====================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));