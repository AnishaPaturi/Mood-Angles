// backend/models/TestResult.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const TestResultSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    testType: { type: String, required: true }, // e.g. "Bipolar", "ADHD"
    score: { type: Number, required: true },
    level: { type: String, required: true },
    answers: { type: Schema.Types.Mixed }, // object mapping Q1..Q20 -> "Answer..."
    agents: {
      agentR: { type: Schema.Types.Mixed },
      agentD: { type: Schema.Types.Mixed },
      agentC: { type: Schema.Types.Mixed },
      agentE: { type: Schema.Types.Mixed },
      agentJ: { type: Schema.Types.Mixed },
    },
    meta: {
      ip: String,
      userAgent: String,
      submittedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

TestResultSchema.index({ user: 1, testType: 1, createdAt: -1 });

export default mongoose.models.TestResult || mongoose.model("TestResult", TestResultSchema);
