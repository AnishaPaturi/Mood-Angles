import mongoose from "mongoose";

const debateSchema = new mongoose.Schema({
  caseId: { type: String, index: true },
  debate_summary: String,
  consensus: String,
  confidence: Number,
  participants: [String],
  disagreements: [String],
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.DebateRecord ||
  mongoose.model("DebateRecord", debateSchema);
