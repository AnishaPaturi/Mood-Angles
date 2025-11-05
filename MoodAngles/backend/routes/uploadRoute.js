import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ✅ Absolute path to uploads folder
const uploadDir = path.join(process.cwd(), "uploads");

// ✅ Create folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ✅ Upload endpoint
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({
    message: "File uploaded successfully",
    filePath: `/uploads/${req.file.filename}`,
  });
});

// ✅ Get list of uploaded files
router.get("/uploads", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ message: "Error reading files" });
    const filePaths = files.map((f) => `/uploads/${f}`);
    res.json(filePaths);
  });
});

// ✅ Delete uploaded file
router.delete("/uploads/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  console.log("🧾 Trying to delete:", filePath);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("✅ File deleted:", filePath);
    res.json({ message: "File deleted successfully" });
  } else {
    console.log("❌ File not found:", filePath);
    res.status(404).json({ message: "File not found" });
  }
});

export default router;
