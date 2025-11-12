// backend/routes/inviteRoutes.js
import express from "express";
import InviteRequest from "../models/InviteRequest.js"; // assume this file exists (pending requests)
import Invite from "../models/Invite.js";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

/**
 * POST /api/invite/request
 * Save a psychiatrist join request (already present in your app)
 */
router.post("/request", async (req, res) => {
  try {
    const { fullName, email, qualification, experience, message } = req.body;

    // prevent duplicate requests for the same email (optional)
    const existing = await InviteRequest.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "You have already submitted a request." });
    }

    const request = new InviteRequest({
      fullName,
      email,
      qualification,
      experience,
      message,
    });

    await request.save();
    return res.status(201).json({ msg: "Request submitted successfully!" });
  } catch (err) {
    console.error("Error in /invite/request:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

/**
 * GET /api/invite/requests
 * Admin: get all requests
 */
router.get("/requests", async (req, res) => {
  try {
    const requests = await InviteRequest.find().sort({ createdAt: -1 });
    return res.json(requests);
  } catch (err) {
    console.error("Error in /invite/requests:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

/**
 * POST /api/invite/approve/:id
 * Admin approves a request -> generate code, save Invite, email code
 */
router.post("/approve/:id", async (req, res) => {
  try {
    const request = await InviteRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "Request not found" });

    // generate code: prefix + 6-digit number (e.g., MA-483219)
    const random6 = Math.floor(100000 + Math.random() * 900000); // 6-digit
    const code = `MA-${random6}`;

    // expiry: 24 hours from now (customize as needed)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // save invite
    const invite = new Invite({
    email: request.email.trim().toLowerCase(),
    code: code.trim().toUpperCase(),
    expiresAt,
    role: "psychiatrist",
    });

    await invite.save();

    // update request status
    request.status = "approved";
    await request.save();

    // send email with Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const inviteInfo = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color:#6e8efb">Your MoodAngles Invite Code</h2>
        <p>Hi ${request.fullName || "Doctor"},</p>
        <p>Your admin has approved your request to join MoodAngles as a psychiatrist.</p>
        <p><strong>Your invite code is:</strong></p>
        <p style="font-size: 20px; font-weight:700; letter-spacing: 2px;">${code}</p>
        <p>This code will expire on: ${expiresAt.toUTCString()}</p>
        <p>Use this code on the signup page: <a href="${process.env.FRONTEND_URL}/PSignup">${process.env.FRONTEND_URL}/PSignup</a></p>
        <hr />
        <p style="font-size:12px; color:#888">If you did not request this, ignore this email.</p>
      </div>
    `;

    const mailOptions = {
      from: `"MoodAngles Admin" <${process.env.EMAIL_USER}>`,
      to: request.email,
      subject: `Your MoodAngles Invite Code — ${code}`,
      html: inviteInfo,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ msg: "Invite code sent", code }); // code returned for admin UI (optional)
  } catch (err) {
    console.error("Error in /invite/approve:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
