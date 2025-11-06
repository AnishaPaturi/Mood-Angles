// backend/models/EmotionRecord.js
import mongoose from "mongoose";

const emotionSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  primary_emotion: String,
  secondary_emotions: [String],
  intensity: String,
  empathy_level_required: String,
  summary: String,
  suggested_response: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.EmotionRecord ||
  mongoose.model("EmotionRecord", emotionSchema);
