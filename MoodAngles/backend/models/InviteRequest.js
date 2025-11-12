import mongoose from "mongoose";

const inviteRequestSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  qualification: { type: String },
  experience: { type: Number },
  message: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const InviteRequest = mongoose.model("InviteRequest", inviteRequestSchema);
export default InviteRequest;
