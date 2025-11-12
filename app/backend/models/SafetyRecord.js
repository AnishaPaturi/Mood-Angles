// backend/models/SafetyRecord.js
import mongoose from "mongoose";

const safetySchema = new mongoose.Schema({
  userId: { type: String, index: true },
  text: String,
  risk_level: String,
  risk_factors: [String],
  summary: String,
  action_recommendation: String,
  support_message: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.SafetyRecord ||
  mongoose.model("SafetyRecord", safetySchema);
