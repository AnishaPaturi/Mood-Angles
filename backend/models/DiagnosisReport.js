// backend/models/DiagnosisReport.js
import mongoose from "mongoose";

const diagnosisReportSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  agent: { type: String, default: "Angel.D" },
  summary: String,
  impression: String,
  risk_level: String,
  confidence: Number,
  recommendations: [String],
  rationale: String,
  references: [String],
  rawLLMResponse: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.DiagnosisReport || mongoose.model("DiagnosisReport", diagnosisReportSchema);
