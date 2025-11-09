import express from "express";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // your user model
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const otpStore = new Map();

// ✉️ SEND OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "No account with this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Mood Angles" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family:sans-serif;">
          <h2>Your MoodAngles OTP</h2>
          <p>Use this code to reset your password:</p>
          <h1 style="color:#ff758c;">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    });

    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    return res.status(500).json({ success: false, message: "Server error sending OTP" });
  }
});

// ✅ VERIFY OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record) return res.json({ success: false, message: "No OTP found or expired" });
  if (record.expires < Date.now()) {
    otpStore.delete(email);
    return res.json({ success: false, message: "OTP expired" });
  }
  if (record.otp !== otp) return res.json({ success: false, message: "Invalid OTP" });

  otpStore.delete(email);
  return res.json({ success: true, message: "OTP verified" });
});

// 🔐 RESET PASSWORD (after OTP verification)
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Error resetting password" });
  }
});

export default router;
