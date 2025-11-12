// backend/routes/authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/User.js";
import {
  registerUser,
  loginUser,
  registerPsychiatrist,
  loginPsychiatrist,
} from "../controllers/authController.js";

dotenv.config();
const router = express.Router();

/* ============================
   USER ROUTES
   ============================ */
router.post("/signup", registerUser);
router.post("/login", loginUser);

/* ============================
   PSYCHIATRIST ROUTES
   ============================ */
router.post("/psychiatrist/signup", registerPsychiatrist);
router.post("/psychiatrist/login", loginPsychiatrist);

/* ============================
   FORGOT + RESET PASSWORD
   ============================ */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const mailOptions = {
      from: `"Mood Angles Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Mood Angles Password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Error sending reset link" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password successfully updated" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

export default router;


