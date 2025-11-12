// backend/models/TreatmentRecord.js
import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  progress: String,
  summary: String,
  risk_change: String,
  recommendations: [String],
  followup_interval_days: Number,
  flag: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.TreatmentRecord ||
  mongoose.model("TreatmentRecord", treatmentSchema);
