import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic personal info
    firstName: { type: String, required: true },
    lastName: { type: String }, // optional, but useful
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    dob: { type: Date }, // date of birth
    city: { type: String, required: true },
    location: { type: String }, // detailed address/location
    profilePic: { type: String, default: "" }, // store image URL

    password: { type: String, required: true },
    terms: { type: Boolean, required: true },

    // ================= Medical Overview =================
    medical: {
      bloodType: { type: String },
      allergies: { type: [String], default: [] },
      medications: { type: [String], default: [] },
      primaryDiagnosis: { type: String }, // e.g., "Bipolar II Disorder"
      lastCheckup: { type: Date },
    },

    // ================= Medical History =================
    history: {
      diagnoses: [
        {
          condition: String,
          diagnosedAt: Date,
          notes: String,
        },
      ],
      treatments: [
        {
          treatment: String,
          startDate: Date,
          endDate: Date,
          notes: String,
        },
      ],
      symptoms: [
        {
          symptom: String,
          reportedAt: { type: Date, default: Date.now },
          severity: { type: String, enum: ["Mild", "Moderate", "Severe"] },
        },
      ],
      medicationHistory: [
        {
          name: String,
          dosage: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      documents: [{ fileUrl: String, uploadedAt: { type: Date, default: Date.now } }],
    },

    // ================= Daily Wellness Check =================
    dailyCheckins: [
      {
        date: { type: Date, default: Date.now },
        sleepQuality: { type: String, enum: ["Poor", "Fair", "Excellent"] },
        energyLevel: { type: Number, min: 1, max: 10 },
        physicalDiscomfort: { type: String },
        mood: { type: String }, // can be emoji/text/scale
        notes: { type: String },
      },
    ],

    // ================= AI Insights =================
    insights: {
      moodTrends: [{ date: Date, mood: String }],
      sleepPatterns: [{ date: Date, quality: String }],
      diagnosisConfidence: { type: Number, min: 0, max: 100 },
      recommendations: [{ type: String }],
      relatedCases: [{ caseId: String, summary: String }],
    },

    // ================= Appointments =================
    appointments: [
      {
        title: String, // e.g., "Therapy Session"
        date: Date,
        time: String,
        purpose: String,
        link: String, // video call link
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
