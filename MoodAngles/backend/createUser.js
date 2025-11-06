import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
await connectDB();

const password = "Test@123"; // test password
const hash = await bcrypt.hash(password, 10);

const newUser = new User({
  firstName: "Ammu",
  lastName: "Bandi",
  email: "test@example.com",
  password: hash,
  phone: "9876543210",
  age: 19,
  gender: "Female",
  city: "Hyderabad",
});

await newUser.save();
console.log("✅ User created successfully:", newUser.email);
process.exit();
