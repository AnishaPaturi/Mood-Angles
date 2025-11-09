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
  googleLogin, // ✅ added this import
} from "../controllers/authController.js";

dotenv.config();
const router = express.Router();

/* =======================================================
   🔐 EXISTING ROUTES
   ======================================================= */
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/psychiatrist/signup", registerPsychiatrist);
router.post("/psychiatrist/login", loginPsychiatrist);

/* =======================================================
   🔹 GOOGLE LOGIN ROUTE
   ======================================================= */
router.post("/google", googleLogin); // ✅ This line adds the missing route

/* =======================================================
   ✉️  FORGOT PASSWORD (USER)
   ======================================================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Create reset token valid for 10 minutes
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

    // 3️⃣ Save reset token (optional — for manual expiry control)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 4️⃣ Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 5️⃣ Send email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const mailOptions = {
      from: `"Mood Angles Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Mood Angles Password",
      html: `
        <h3>Hello ${user.firstName || "User"},</h3>
        <p>You requested a password reset. Click below to set a new password:</p>
        <a href="${resetLink}" style="background:#007BFF;color:white;padding:10px 20px;text-decoration:none;border-radius:8px;">
          Reset Password
        </a>
        <p>This link expires in 10 minutes. If you didn’t request this, you can safely ignore it.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Error sending reset link" });
  }
});

/* =======================================================
   🔑 RESET PASSWORD (USER)
   ======================================================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 1️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2️⃣ Find user and check token expiry
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Update and clear token fields
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
