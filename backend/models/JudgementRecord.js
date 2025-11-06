import mongoose from "mongoose";

const judgementSchema = new mongoose.Schema({
  caseId: { type: String, index: true },
  fairness_score: Number,
  bias_detected: String,
  bias_reasoning: String,
  ethical_flags: [String],
  recommendation: String,
  judgement_summary: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.JudgementRecord ||
  mongoose.model("JudgementRecord", judgementSchema);
