import mongoose from "mongoose";

const psychiatristSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    age: {
      type: Number,
      required: true,
      min: [25, "Psychiatrists must be at least 25 years old"],
    },
    experience: {
      type: Number,
      required: true,
      min: [0, "Experience cannot be negative"],
    },
    qualification: {
      type: String,
      required: [true, "Qualification is required"],
      enum: [
        "mbbs-md-psychiatry",
        "mbbs-dpm",
        "mbbs-dnb-psychiatry",
        "do-psychiatry",
        "board-psychiatrist",
        "mphil-clinical-psychology",
        "phd-clinical-psychology",
        "psyd",
        "ma-msc-psychology",
        "mphil-counseling-psychology",
      ],
    },
  },
  { timestamps: true }
);

const Psychiatrist = mongoose.model("Psychiatrist", psychiatristSchema);
export default Psychiatrist;
