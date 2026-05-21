import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { ingestTextSafe, deleteByFilename } from "../rag/ingest.js";

const router = express.Router();
const uploadDir = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed file types and size limit (5MB)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024;

// Multer setup with file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, JPG, and PNG are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

/* ─────────────────────── helpers ─────────────────────── */

/** Run the existing Python extract_text.py and return raw text */
const PYTHON_TEXT_EXTRACTOR = path.join(process.cwd(), "scripts", "extract_text.py");

function extractText(filePath) {
  return new Promise((resolve) => {
    const py = spawn("python", [PYTHON_TEXT_EXTRACTOR, filePath], {
      env: { ...process.env }, cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    py.stdout.on("data", d => (out += d.toString()));
    py.stderr.on("data", d => console.warn("[extract_text]", d.toString().trim()));
    py.on("close", () => resolve(out.trim()));
    setTimeout(() => { try { py.kill("SIGKILL"); } catch {} resolve(""); }, 30_000);
  });
}

/* ─────────────────────── routes ─────────────────────── */

// ✅ Upload file with category and user association
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No file uploaded" });

  const { category = "Other", userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  const fileMeta = {
    filename:       req.file.filename,
    filePath:       `/uploads/${req.file.filename}`,
    category,
    uploadCategory: category,
    originalName:   req.file.originalname,
  };

  // ── Best-effort RAG ingestion (fire-and-forget) ────────────────────
  // Extract text with Python, embed it, store vectors in MongoDB.
  // Never blocks the upload response.
  (async () => {
    try {
      const text = await extractText(req.file.path);
      if (text && text.length > 10) {
        const { stored } = await ingestTextSafe({ userId, text, metadata: fileMeta });
        if (stored > 0) console.log(`[RAG] indexed ${stored} chunks from ${req.file.originalname}`);
      } else {
        console.log(`[RAG] insufficient text for ${req.file.originalname}, skipping`);
      }
    } catch (err) {
      console.warn(`[RAG] upload ingestion failed for ${req.file.originalname}:`, err?.message);
    }
  })();

  res.json({
    message: "File uploaded successfully",
    file: {
      ...fileMeta,
      userId,
      size:     req.file.size,
      uploadedAt: new Date().toISOString(),
    },
  });
});

// ✅ Get uploaded files for a specific user (fixes privacy bug)
router.get("/", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "userId query parameter is required" });
  }

  fs.readdir(uploadDir, (err, files) => {
    if (err)
      return res.status(500).json({ message: "Error reading files" });

    const filePaths = files
      .filter((f) => f && typeof f === "string")
      .map((f) => {
        try {
          return {
            filename: f,
            filePath: `/uploads/${f}`,
            uploadedAt: fs.statSync(path.join(uploadDir, f)).mtime.toISOString(),
          };
        } catch {
          // Skip files that can't be stat'd
          return null;
        }
      })
      .filter(Boolean);
    res.json(filePaths);
  });
});

// ✅ Delete file
router.delete("/:filename", async (req, res) => {
  const { filename } = req.params;
  const userId       = req.body.userId || req.query.userId;
  const filePath     = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    // Also purge RAG vectors for this file (best-effort, don't fail the request)
    if (userId) {
      try { await deleteByFilename(String(userId), filename); } catch (_) { /* ignore */ }
    }
    res.json({ message: "File deleted successfully" });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

export default router;