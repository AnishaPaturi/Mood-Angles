import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // You can use email or Firebase UID
  darkMode: { type: Boolean, default: false },
  notifications: { type: Boolean, default: true },
  emailUpdates: { type: Boolean, default: true },
  privateAccount: { type: Boolean, default: false },
  dailyReminders: { type: Boolean, default: true },
  quoteReminders: { type: Boolean, default: true },
  feedback: { type: String, default: "" },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("UserSettings", settingsSchema);
