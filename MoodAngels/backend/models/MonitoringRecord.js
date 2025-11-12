// backend/models/MonitoringRecord.js
import mongoose from "mongoose";

const monitoringSchema = new mongoose.Schema({
  agent: { type: String, required: true },
  userId: String,
  input: Object,
  output: Object,
  latencyMs: Number,
  confidence: Number,
  error: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.MonitoringRecord ||
  mongoose.model("MonitoringRecord", monitoringSchema);
