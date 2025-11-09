import User from "../models/User.js";
import Psychiatrist from "../models/psychiatrist.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

/* =======================================================
   🔹 GOOGLE LOGIN SETUP
   ======================================================= */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* =======================================================
   🧍 USER CONTROLLERS
   ======================================================= */

// User Signup
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, age, city, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      gender,
      age,
      city,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

    res.json({ userId: user._id, firstName: user.firstName, role: "user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/* =======================================================
   🧠 PSYCHIATRIST CONTROLLERS
   ======================================================= */

// Psychiatrist Signup
export const registerPsychiatrist = async (req, res) => {
  try {
    const { fullName, email, password, phone, age, experience, qualification } = req.body;

    const existingPsy = await Psychiatrist.findOne({ email });
    if (existingPsy) return res.status(400).json({ msg: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const psychiatrist = new Psychiatrist({
      fullName,
      email,
      password: hashedPassword,
      phone,
      age,
      experience,
      qualification,
    });

    await psychiatrist.save();
    res.status(201).json({ msg: "Psychiatrist registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Psychiatrist Login
export const loginPsychiatrist = async (req, res) => {
  try {
    const { email, password } = req.body;

    const psy = await Psychiatrist.findOne({ email });
    if (!psy) return res.status(400).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, psy.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

    res.json({ psyId: psy._id, fullName: psy.fullName, role: "psychiatrist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

/* =======================================================
   🌐 SECURE GOOGLE LOGIN CONTROLLER
   ======================================================= */
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Missing Google credential" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // ✅ find or create
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firstName: name?.split(" ")[0] || "",
        lastName: name?.split(" ")[1] || "",
        email,
        googleId,
        profilePhoto: picture,
        role: "user",
      });
    }

    // ✅ JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("✅ Google login successful for:", email);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("❌ Google login failed:", error);
    res.status(500).json({ message: "Google login failed", error: error.message });
  }
};
