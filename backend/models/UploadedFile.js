import mongoose from "mongoose";

const uploadedFileSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  category: { type: String, default: "Other" },
  originalName: { type: String },
  size: { type: Number },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.models.UploadedFile || mongoose.model("UploadedFile", uploadedFileSchema);