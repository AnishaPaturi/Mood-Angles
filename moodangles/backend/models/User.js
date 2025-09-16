import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
  terms: { type: Boolean, required: true }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
