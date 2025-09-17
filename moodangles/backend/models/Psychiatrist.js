import mongoose from "mongoose";

const psychiatristSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true, min: 25 },
    experience: { type: Number, required: true, min: 0 },
    qualification: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Psychiatrist", psychiatristSchema);
