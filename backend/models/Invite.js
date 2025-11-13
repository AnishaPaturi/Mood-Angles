// backend/models/Invite.js
import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, lowercase: true },
  role: { type: String, default: "psychiatrist" },
  code: { type: String, required: true, unique: true }, // ✅ Use "code" instead of "token"
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 365 * 24 * 60 * 60 * 1000, // valid for 1 year
  },
  used: { type: Boolean, default: false },
});

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;
