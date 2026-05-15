import express from "express";
import Feedback from "../models/Feedback.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Feedback submission route
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ error: "All fields are required" });

    // Save feedback in MongoDB
    const feedback = new Feedback({ name, email, message });
    await feedback.save();

    // Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"MoodAngles Feedback" <${process.env.EMAIL_USER}>`,
      to: "moodangles@gmail.com",
      subject: `📝 New Feedback from ${name}`,
      html: `
        <h3>New Feedback Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b><br>${message}</p>
        <hr/>
        <p>Sent automatically by MoodAngles Feedback System</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (err) {
    console.error("Error submitting feedback:", err);
    res.status(500).json({ error: "Feedback submission failed" });
  }
});

export default router;
