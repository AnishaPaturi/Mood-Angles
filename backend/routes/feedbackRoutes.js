import express from "express";
import Feedback from "../models/Feedback.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Feedback submission route
router.post("/", async (req, res) => {
  try {
    console.log(" Feedback route hit");
    const { name, email, message } = req.body;
    console.log(" Body received:", { name, email, message: message ? message.substring(0, 50) : "undef" });

    if (!name || !email || !message) {
      console.log(" Validation failed");
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log(" Saving to MongoDB...");
    // ✅ Save feedback in MongoDB
    const feedback = new Feedback({ name, email, message });
    await feedback.save();
    console.log(" Saved feedback ID:", feedback._id);

    console.log(" Creating transporter...");
    // ✅ Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });
    console.log(" Transporter created");

    console.log(" Verifying transporter...");
    await transporter.verify();
    console.log(" Transporter verified");

    // ✅ Email content
    const mailOptions = {
      from: `"MoodAngles Feedback" <${process.env.EMAIL_USER}>`,
      to: "moodangles@gmail.com", // admin email
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

    console.log(" Sending email...");
    // ✅ Send email
    await transporter.sendMail(mailOptions);
    console.log(" Email sent");

    res.json({
      success: true,
      message: "Feedback submitted successfully and email sent!",
    });
  } catch (err) {
    console.error("❌ Error submitting feedback:", err);
    res.status(500).json({ error: "Feedback submission failed" });
  }
});

export default router;
