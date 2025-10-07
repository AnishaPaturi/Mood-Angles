import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: String,
  agent: { type: String, default: "Angel.R" },
  hasMoodDisorder: Boolean,
  confidence: Number,
  reasoning: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Diagnosis", schema);