import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import agentRRoute from "./routes/agentR.js"; 
// import agentRTestRoute from "./routes/agentRTestRoute.js";
// import agentDRoute from "./routes/agentD.js"; 
import agentCRoute from "./routes/agentC.js";
// import agentTRoute from "./routes/agentT.js";
// import agentERoute from "./routes/agentE.js";
// import agentXRoute from "./routes/agentX.js";
// import agentMRoute from "./routes/agentM.js";
// import agentSRoute from "./routes/agentS.js";
import agentJRoute from "./routes/agentJ.js"; 
import agentBRoute from "./routes/agentB.js"; 
import uploadRoute from "./routes/uploadRoute.js";


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api", agentRRoute);
// app.use("/api", agentRTestRoute);
// app.use("/api", agentDRoute);
app.use("/api", agentCRoute);
// app.use("/api", agentTRoute);
// app.use("/api", agentERoute);
// app.use("/api", agentXRoute);
// app.use("/api", agentMRoute);
// app.use("/api", agentSRoute);
app.use("/api", agentJRoute);
app.use("/api", agentBRoute);
app.use("/api", uploadRoute);

// =================== AGENT R INTEGRATION ===================
import { spawn } from "child_process";

app.post("/api/angelR", (req, res) => {
  const py = spawn("python", ["agentR.py"]); // adjust if python3 is needed
  let output = "";

  py.stdin.write(JSON.stringify(req.body));
  py.stdin.end();

  py.stdout.on("data", (data) => (output += data.toString()));
  py.stderr.on("data", (err) => console.error("⚠️ Agent R error:", err.toString()));

  py.on("close", () => {
    try {
      const parsed = JSON.parse(output);
      res.json(parsed);
    } catch (err) {
      console.error("❌ Invalid Agent R response:", output);
      res.status(500).json({ error: "Agent R failed", raw: output });
    }
  });
});

// =================== AGENT D INTEGRATION (robust) ===================
import path from "path";

app.post("/api/angelD", (req, res) => {
  const PY = process.env.PYTHON_PATH || (process.platform === "win32" ? "python" : "python3");
  const script = path.join(process.cwd(), "agentD.py");

  let stdout = "";
  let stderr = "";
  let killedByTimeout = false;

  const py = spawn(PY, [script], {
    env: { ...process.env },
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  // spawn-level error (e.g., executable not found)
  py.on("error", (err) => {
    console.error("⚠️ spawn error for agentD:", err);
    return res.status(500).json({ error: "agent_d_spawn_error", details: String(err) });
  });

  try {
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();
  } catch (e) {
    console.error("⚠️ Failed to write to Agent D stdin:", e);
    // kill child if still running
    try { py.kill(); } catch {}
    return res.status(500).json({ error: "agent_d_stdin_error", details: String(e) });
  }

  py.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
  py.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

  // kill if it runs too long
  const timeLimit = Number(process.env.AGENT_PY_TIMEOUT_MS || 15000);
  const killTimeout = setTimeout(() => {
    killedByTimeout = true;
    try { py.kill("SIGKILL"); } catch (e) { console.error("Error killing agentD:", e); }
  }, timeLimit);

  py.on("close", (code, signal) => {
    clearTimeout(killTimeout);

    if (killedByTimeout) {
      console.error("❌ Agent D killed by timeout. stdout:", stdout, "stderr:", stderr);
      return res.status(500).json({ error: "agent_d_timed_out", stdout, stderr });
    }

    // spawn error sometimes gives code === null; report signal too
    if (code !== 0) {
      console.error("❌ Agent D exited with code", code, "signal", signal, "stderr:", stderr);
      return res.status(500).json({ error: "agent_d_failed", code, signal, stderr, stdout });
    }

    // parse stdout
    try {
      const parsed = JSON.parse(stdout.trim());
      return res.json(parsed);
    } catch (err) {
      console.error("❌ Could not JSON.parse agentD stdout:", stdout, "err:", err, "stderr:", stderr);
      return res.status(500).json({ error: "agent_d_invalid_response", parseError: String(err), stdout, stderr });
    }
  });
});




const PORT = process.env.PORT || 5000;
app.use("/uploads", express.static("uploads"));
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

