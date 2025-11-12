import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import Invite from "../models/Invite.js";
import Psychiatrist from "../models/psychiatrist.js"; // your file earlier used lowercase
import User from "../models/User.js";

/* =======================================================
   CONFIG
   ======================================================= */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* =======================================================
   USER CONTROLLERS
   ======================================================= */

// Register User
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, age, city, password } = req.body;

    if (!email || !password) return res.status(400).json({ msg: "Email and password required." });

    const cleanEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) return res.status(400).json({ msg: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email: cleanEmail,
      phone,
      gender,
      age,
      city,
      password: hashedPassword,
    });

    await user.save();
    return res.status(201).json({ msg: "User registered successfully." });
  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = String(email || "").trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(400).json({ msg: "Invalid email or password." });

    if (!user.password) return res.status(400).json({ msg: "Account registered via Google. Please use Google login." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password." });

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: { id: user._id, name: user.firstName, email: user.email },
    });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/* =======================================================
   PSYCHIATRIST CONTROLLERS
   ======================================================= */

// Register Psychiatrist (Invite-based)
export const registerPsychiatrist = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      phone,
      age,
      experience,
      qualification,
      code,
    } = req.body;

    if (!email || !password || !code) {
      return res.status(400).json({ msg: "Email, password, and invite code are required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanCode = String(code).trim().toUpperCase();

    // find invite
    const invite = await Invite.findOne({ email: cleanEmail, code: cleanCode });
    if (!invite) return res.status(400).json({ msg: "Invite code does not belong to this email." });

    // expiry
    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      return res.status(400).json({ msg: "Invite code has expired." });
    }

    // used
    if (invite.used) return res.status(400).json({ msg: "This invite code has already been used." });

    // existing psychiatrist
    const existingPsy = await Psychiatrist.findOne({ email: cleanEmail });
    if (existingPsy) return res.status(400).json({ msg: "Email already registered as psychiatrist." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const psychiatrist = new Psychiatrist({
      fullName,
      email: cleanEmail,
      password: hashedPassword,
      phone,
      age,
      experience,
      qualification,
      role: "psychiatrist",
    });

    await psychiatrist.save();

    // mark invite used
    invite.used = true;
    await invite.save();

    const token = jwt.sign({ id: psychiatrist._id, role: "psychiatrist" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      msg: "Psychiatrist signup successful!",
      token,
      psychiatrist: { id: psychiatrist._id, name: psychiatrist.fullName, email: psychiatrist.email },
    });
  } catch (err) {
    console.error("registerPsychiatrist error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Login Psychiatrist
export const loginPsychiatrist = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email and password required." });

    const cleanEmail = String(email).trim().toLowerCase();
    const psy = await Psychiatrist.findOne({ email: cleanEmail });
    if (!psy) return res.status(400).json({ msg: "Invalid email or password." });

    if (!psy.password) return res.status(400).json({ msg: "Account registered via Google. Please use Google login." });

    const isMatch = await bcrypt.compare(password, psy.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password." });

    const token = jwt.sign({ id: psy._id, role: "psychiatrist" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      msg: "Login successful",
      token,
      psychiatrist: { id: psy._id, name: psy.fullName, email: psy.email },
    });
  } catch (err) {
    console.error("loginPsychiatrist error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/* =======================================================
   GOOGLE LOGIN (optional)
   ======================================================= */

// If you don't use Google right now, this is a harmless placeholder.
// If you do use Google OAuth, you'll want to implement properly.
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Missing Google credential" });

    // verify token if you actually use Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = String(payload.email || "").trim().toLowerCase();

    // find or create user (simple)
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firstName: payload.given_name || "",
        lastName: payload.family_name || "",
        email,
        googleId: payload.sub,
        profilePhoto: payload.picture,
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role || "user" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ msg: "Google login successful", token, user });
  } catch (err) {
    console.error("googleLogin error:", err);
    return res.status(500).json({ msg: "Google login failed", error: err.message });
  }
};
