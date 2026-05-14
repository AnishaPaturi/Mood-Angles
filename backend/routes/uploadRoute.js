import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

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

// ✅ Upload file with category and user association
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No file uploaded" });

  const { category = "Other", userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  res.json({
    message: "File uploaded successfully",
    file: {
      filename: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      category,
      userId,
      originalName: req.file.originalname,
      size: req.file.size,
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
router.delete("/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: "File deleted successfully" });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

export default router;