import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import User from "../models/User.js";
import Psychiatrist from "../models/Psychiatrist.js";

const router = express.Router();

// ==================== USER SIGNUP ====================
router.post("/signup", async (req, res) => {
  try {
    const { firstName, email, phone, gender, age, city, password, terms } = req.body;

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$._])[A-Za-z\d@#$._]{8,}$/;
    if (!passwordRegex.test(password))
      return res.status(400).json({ msg: "Password does not meet constraints." });

    if (!terms) return res.status(400).json({ msg: "You must agree to the terms." });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      email,
      phone,
      gender,
      age,
      city,
      password: hashedPassword,
      terms,
    });

    await newUser.save();
    res.json({ msg: "User registered successfully!", user: { firstName, email, city } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== USER LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({
      msg: "Login successful",
      user: {
        firstName: user.firstName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        age: user.age,
        city: user.city,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PSYCHIATRIST SIGNUP ====================
router.post("/psychiatrist/signup", async (req, res) => {
  try {
    const { fullName, email, password, phone, age, experience, qualification } = req.body;

    const existing = await Psychiatrist.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPsychiatrist = new Psychiatrist({
      fullName,
      email,
      password: hashedPassword,
      phone,
      age,
      experience,
      qualification,
    });

    await newPsychiatrist.save();
    res.status(201).json({ msg: "Psychiatrist registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PSYCHIATRIST LOGIN ====================
router.post("/psychiatrist/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const psychiatrist = await Psychiatrist.findOne({ email });
    if (!psychiatrist) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, psychiatrist.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({
      msg: "Login successful",
      psychiatrist: {
        id: psychiatrist._id,
        fullName: psychiatrist.fullName,
        email: psychiatrist.email,
        phone: psychiatrist.phone,
        age: psychiatrist.age,
        experience: psychiatrist.experience,
        qualification: psychiatrist.qualification,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== GOOGLE LOGIN ====================
// Start Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful login
    res.redirect("/dashboard"); // Redirect your React frontend
  }
);

export default router;
