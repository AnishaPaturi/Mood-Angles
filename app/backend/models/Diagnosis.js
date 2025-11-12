// models/Diagnosis.js
import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  agent: { type: String, default: "Angel.R" },
  hasMoodDisorder: Boolean,
  confidence: Number,
  reasoning: String,
  rawLLMResponse: Object,
  mlProbability: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Diagnosis || mongoose.model("Diagnosis", diagnosisSchema);
