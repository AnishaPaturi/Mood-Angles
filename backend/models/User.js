import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },

  email: { type: String, required: true, unique: true },

  password: {
    type: String,
    required: function () {
      // Password required only for manual signup (not Google)
      return !this.googleId;
    },
  },

  googleId: { type: String, default: null },
  profilePhoto: { type: String, default: "" },

  phone: {
    type: String,
    match: /^[0-9]{10}$/,
    required: false,
  },

  age: { type: Number, required: false },
  gender: { type: String, required: false },
  city: { type: String, required: false },

  // ✅ Role & verification
  role: {
    type: String,
    enum: ["user", "psychiatrist", "admin"],
    default: "user",
  },
  verified: {
    type: Boolean,
    default: false, // psychiatrist accounts can be manually verified
  },

  // ✅ Account status management
  status: {
    type: String,
    enum: ["active", "pending", "suspended"],
    default: "active",
  },

  // 🔐 Password reset tokens
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  // 🌤️ Wellness mood check-ins (new)
  moodHistory: {
    type: [
      {
        date: { type: String, required: true },
        mood: { type: String, required: true },
      },
    ],
    default: [],
  },

  // 📅 Timestamps
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date },
});

// Index for email + role (faster lookups)
userSchema.index({ email: 1, role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
