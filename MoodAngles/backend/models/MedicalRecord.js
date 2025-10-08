// models/MedicalRecord.js
import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  narrative: { type: String, default: "" },
  structured: { type: Object }, // optional JSON-structured record
  date: { type: Date, default: Date.now }
});

export default mongoose.models.MedicalRecord || mongoose.model("MedicalRecord", medicalRecordSchema);
