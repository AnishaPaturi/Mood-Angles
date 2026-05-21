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
import documentAnalysis from "./routes/documentAnalysis.js";
import chatbotRoute from "./routes/chatbotRoute.js";


// ✅ Load environment variables
dotenv.config();
console.log('MONGO_URI from env:', process.env.MONGO_URI ? 'SET' : 'NOT SET');

// ✅ Connect to MongoDB
connectDB();

// ✅ Initialize app
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://mood-angles-6.onrender.com",
    ],
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});
app.use("/api/feedback", feedbackRoutes);

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoute);
app.use("/api/uploads", uploadRoute);
app.use("/uploads", express.static("uploads"));

app.use("/api/otp", otpRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/documents", documentAnalysis);
app.use("/api/results", resultsRoute);
app.use("/api/chatbot", chatbotRoute);



/* =========================================================
   ✅ AGENT R (Already in your code — kept EXACTLY as is)
   ========================================================= */
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

  const timeLimit = Number(process.env.AGENT_PY_TIMEOUT_MS || 60000);
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



/* =========================================================
   ✅ UNIVERSAL PYTHON AGENT RUNNER (NEW)
   ========================================================= */
function runPythonAgent(req, res, scriptName) {
  const PY =
    process.env.PYTHON_PATH ||
    (process.platform === "win32" ? "python" : "python3");

  const script = path.join(process.cwd(), scriptName);

  let stdout = "";
  let stderr = "";
  let killedByTimeout = false;

  const py = spawn(PY, [script], {
    env: { ...process.env },
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
  });

  py.on("error", (err) => {
    console.error(`⚠️ spawn error for ${scriptName}:`, err);
    return res.status(500).json({
      error: `${scriptName}_spawn_error`,
      details: String(err),
    });
  });

  try {
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();
  } catch (e) {
    console.error(`⚠️ Failed to write to ${scriptName} stdin:`, e);
    try {
      py.kill();
    } catch {}
    return res.status(500).json({
      error: `${scriptName}_stdin_error`,
      details: String(e),
    });
  }

  py.stdout.on("data", (chunk) => (stdout += chunk.toString()));
  py.stderr.on("data", (chunk) => (stderr += chunk.toString()));

  const timeLimit = Number(process.env.AGENT_PY_TIMEOUT_MS || 60000);
  const killTimeout = setTimeout(() => {
    killedByTimeout = true;
    try {
      py.kill("SIGKILL");
    } catch (e) {
      console.error(`Error killing ${scriptName}:`, e);
    }
  }, timeLimit);

  py.on("close", (code, signal) => {
    clearTimeout(killTimeout);

    if (killedByTimeout)
      return res
        .status(500)
        .json({ error: `${scriptName}_timed_out`, stdout, stderr });

    if (code !== 0)
      return res.status(500).json({
        error: `${scriptName}_failed`,
        code,
        signal,
        stderr,
        stdout,
      });

    try {
      const parsed = JSON.parse(stdout.trim());
      return res.json(parsed);
    } catch (err) {
      console.error(`❌ Could not JSON.parse ${scriptName} stdout:`, stdout);
      return res.status(500).json({
        error: `${scriptName}_invalid_response`,
        stdout,
        stderr,
      });
    }
  });
}



/* =========================================================
   🤖 NEW AGENT ROUTES (FULL PIPELINE)
   ========================================================= */

// 👉 Agent D
app.post("/api/angelD", (req, res) => {
  runPythonAgent(req, res, "agentD.py");
});

// 👉 Agent C
app.post("/api/angelC", (req, res) => {
  runPythonAgent(req, res, "agentC.py");
});

// 👉 Agent E
app.post("/api/angelE", (req, res) => {
  runPythonAgent(req, res, "agentE.py");
});

// 👉 Agent J
app.post("/api/angelJ", (req, res) => {
  runPythonAgent(req, res, "agentJ.py");
});



function cosineSim(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || b.length === 0) return 0;
  let dot=0, ma=0, mb=0;
  for (let i=0; i<a.length; i++) { dot+=a[i]*b[i]; ma+=a[i]*a[i]; mb+=b[i]*b[i]; }
  const denom=Math.sqrt(ma)*Math.sqrt(mb);
  return denom === 0 ? 0 : dot/denom;
}



/* =========================================================
   📚 RAG ADMIN ROUTES
   Bulk write & query DocumentChunk via HTTP
   (used by data/ingest_rag_data.py)
   ========================================================= */

import DocumentChunk from "./models/DocumentChunk.js";

/**
 * POST /api/admin/rag-batch
 * Body: { chunks: [{ userId, content, embedding[], metadata{} }] }
 * Upserts each chunk idempotently.
 */
app.post("/api/admin/rag-batch", async (req, res) => {
  try {
    const { chunks } = req.body || {};
    if (!Array.isArray(chunks) || chunks.length === 0) {
      return res.status(400).json({ error: "chunks array required" });
    }
    let stored = 0;
    for (const c of chunks) {
      try {
        const filter = { _id: c.id };
        const update = {
          userId:         c.userId        || "system",
          conversationId: c.conversationId || null,
          chunkIndex:     c.chunkIndex    ?? 0,
          content:        c.content,
          embedding:      c.embedding     || [],
          metadata:       c.metadata      || {},
        };
        const opts = { new: true, upsert: true };
        await DocumentChunk.findOneAndUpdate(filter,   update, opts);
        stored++;
      } catch (e) {
        console.warn("[rag-batch] skip chunk:", e.message);
      }
    }
    res.json({ stored, total: chunks.length });
  } catch (err) {
    console.error("[rag-batch] fatal:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/rag-query
 * Body: { userId, query, topK: 5 }
 *   — if the body also contains 'queryEmbedding: [float]' we use it directly;
 *     otherwise we compute embedding via OpenAI and return scored results.
 * Returns [{ pageContent, metadata, score }] top-K similar chunks.
 */
app.post("/api/admin/rag-query", async (req, res) => {
  try {
    const { userId, query, topK = 5, queryEmbedding } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    // Fetch all chunks for this user
    const docs = await DocumentChunk.find({ userId }).lean();
    if (!docs.length) return res.json({ results: [] });

    let qVec = queryEmbedding;
    if (!qVec && query) {
      // Compute embedding lazily via OpenAI — async, grab from environment
      try {
        const { OpenAIEmbeddings } = (await import("@langchain/openai"));
        const emb  = new OpenAIEmbeddings({ modelName: "text-embedding-ada-002" });
        qVec      = await emb.embedQuery(query);
      } catch(err) {
        console.warn("[rag-query] OpenAI embedding failed:", err.message);
      }
    }

    const scored = docs
      .filter(d => Array.isArray(d.embedding) && d.embedding.length > 0)
      .map(d => ({ doc: d, score: cosineSim(qVec || [], d.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => ({
        pageContent : s.doc.content,
        metadata    : s.doc.metadata,
        score       : parseFloat(s.score.toFixed(4)),
      }));
    res.json({ results: scored });
  } catch (err) {
    console.error("[rag-query] fatal:", err);
    res.status(500).json({ error: err.message });
  }
});



/* =========================================================
   ✅ START SERVER
   ========================================================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
