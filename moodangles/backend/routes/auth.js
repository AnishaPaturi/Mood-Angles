import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// ==================== SIGNUP ====================
router.post("/signup", async (req, res) => {
  try {
    const { firstName, email, phone, gender, age, city, password, terms } = req.body;

    // Password validation regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$._])[A-Za-z\d@#$._]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ msg: "Password does not meet constraints." });
    }

    if (!terms) {
      return res.status(400).json({ msg: "You must agree to the terms." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      firstName,
      email,
      phone,
      gender,
      age,
      city,
      password: hashedPassword,
      terms
    });

    await newUser.save();
    res.json({ msg: "User registered successfully!", user: { firstName, email, city } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Respond with user data (excluding password)
    const { firstName, phone, gender, age, city } = user;
    res.json({
      msg: "Login successful",
      user: { firstName, email: user.email, phone, gender, age, city }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
