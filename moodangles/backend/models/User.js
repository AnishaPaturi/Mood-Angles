import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {
    type: String,
    match: /^[0-9]{10}$/, // 10 digits allowed
    required: false,
  },
  age: { type: Number, required: false },
  gender: { type: String, required: false },
  city: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
