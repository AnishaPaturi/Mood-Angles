// models/ScaleResponse.js
import mongoose from "mongoose";

const scaleResponseSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  responses: { type: Object, required: true }, // e.g. { phq9_Q1: 2, ... }
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ScaleResponse || mongoose.model("ScaleResponse", scaleResponseSchema);
