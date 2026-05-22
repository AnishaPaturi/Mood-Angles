// backend/models/Question.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const QuestionSchema = new Schema(
  {
    category: { type: String, required: true, index: true }, // e.g. "anxiety", "depression", "adhd"
    text: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

QuestionSchema.index({ category: 1, order: 1 });

QuestionSchema.pre("save", function (next) {
  if (!this.order) {
    this.order = this._doc?.order ?? Date.now();
  }
  next();
});

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
