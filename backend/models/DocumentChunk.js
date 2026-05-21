// backend/models/DocumentChunk.js
import mongoose from "mongoose";

const documentChunkSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  conversationId: { type: String, default: null },
  chunkIndex: { type: Number, required: true },
  content: { type: String, required: true },
  embedding: { type: [Number], default: [] },
  metadata: {
    filename: { type: String, default: "" },
    filePath:  { type: String, default: "" },
    category:  { type: String, default: "Other" },
    uploadCategory: { type: String, default: "" },
  },
}, { timestamps: true });

// Compound index for efficient similarity + user filtering
documentChunkSchema.index({ userId: 1, chunkIndex: 1 });

export default mongoose.models.DocumentChunk
  || mongoose.model("DocumentChunk", documentChunkSchema);
