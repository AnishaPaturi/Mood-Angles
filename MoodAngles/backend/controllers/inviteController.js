import Invite from "../models/Invite.js";
import InviteRequest from "../models/InviteRequest.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

/* 🧠 Psychiatrist submits request */
export const requestInvite = async (req, res) => {
  try {
    const { fullName, email, qualification, experience, message } = req.body;

    const existing = await InviteRequest.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ msg: "You have already submitted a request." });

    const request = new InviteRequest({
      fullName,
      email,
      qualification,
      experience,
      message,
    });

    await request.save();
    res.status(201).json({ msg: "Request submitted successfully!" });
  } catch (error) {
    console.error("❌ Error in requestInvite:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/* 👨‍⚕️ Admin approves and sends invite */
export const approveInvite = async (req, res) => {
  try {
    const request = await InviteRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "Request not found" });

    const token = crypto.randomUUID();

    const invite = new Invite({
      email: request.email,
      role: "psychiatrist",
      token,
    });

    await invite.save();

    request.status = "approved";
    await request.save();

    const signupLink = `https://moodangles.vercel.app/PSignup?invite=${token}`;

    // 📨 Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"MoodAngles Admin" <${process.env.EMAIL_USER}>`,
      to: request.email,
      subject: "You're invited to join MoodAngles 💫",
      html: `
        <h2>Hello Dr. ${request.fullName || "Professional"},</h2>
        <p>You’ve been approved to join <strong>MoodAngles</strong> as a Psychiatrist.</p>
        <p>Click below to create your account:</p>
        <a href="${signupLink}" style="background:#6e8efb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">Join Now</a>
        <p>Welcome aboard 🌻</p>
      `,
    });

    res.status(200).json({ msg: "Invite sent successfully", link: signupLink });
  } catch (err) {
    console.error("❌ Error in approveInvite:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* 📋 Admin fetch all requests */
export const getAllRequests = async (req, res) => {
  try {
    const requests = await InviteRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error in getAllRequests:", error);
    res.status(500).json({ error: "Server error" });
  }
};
