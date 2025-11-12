// backend/models/Conversation.js
import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
  userId: String,
  messages: [
    {
      role: String, // "user" or "assistant"
      content: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});
export default mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
