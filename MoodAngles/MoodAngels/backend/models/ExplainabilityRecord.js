// backend/models/ExplainabilityRecord.js
import mongoose from "mongoose";

const explainabilitySchema = new mongoose.Schema({
  userId: { type: String, index: true },
  explanation_summary: String,
  top_features: [String],
  feature_influences: Object,
  confidence_analysis: String,
  alternative_hypotheses: [String],
  clinician_notes: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.ExplainabilityRecord ||
  mongoose.model("ExplainabilityRecord", explainabilitySchema);
