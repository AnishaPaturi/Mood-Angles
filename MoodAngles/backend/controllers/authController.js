import User from "../models/User.js";
import Psychiatrist from "../models/psychiatrist.js";
import bcrypt from "bcryptjs";

// -------------------- User Controllers --------------------

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

// User Login (no JWT)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

    // Send only basic info
    res.json({ userId: user._id, firstName: user.firstName, role: "user" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- Psychiatrist Controllers --------------------

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

// Psychiatrist Login (no JWT)
export const loginPsychiatrist = async (req, res) => {
  try {
    const { email, password } = req.body;

    const psy = await Psychiatrist.findOne({ email });
    if (!psy) return res.status(400).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, psy.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

    // Send basic info
    res.json({ psyId: psy._id, fullName: psy.fullName, role: "psychiatrist" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
