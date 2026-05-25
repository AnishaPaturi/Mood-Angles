// backend/routes/medicalRoutes.js
import express from "express";
import MedicalRecord from "../models/MedicalRecord.js";

const router = express.Router();

// ✅ Get all medical records for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🔍 Fetching medical records for userId: ${userId}`);

    const medicalRecords = await MedicalRecord.find({ userId })
      .sort({ date: -1 }) // Most recent first
      .select("-__v"); // Exclude version key

    console.log(`📊 Found medical records count: ${medicalRecords.length}`);
    res.json({ medicalRecords });
  } catch (err) {
    console.error("❌ Error in GET /medical/:userId:", err);
    res.status(500).json({ error: "Failed to fetch medical records" });
  }
});

// ✅ Get a specific medical record by ID
router.get("/record/:recordId", async (req, res) => {
  try {
    const { recordId } = req.params;
    const medicalRecord = await MedicalRecord.findById(recordId)
      .select("-__v");

    if (!medicalRecord) {
      return res.status(404).json({ error: "Medical record not found" });
    }

    res.json({ medicalRecord });
  } catch (err) {
    console.error("❌ Error in GET /medical/record/:recordId:", err);
    res.status(500).json({ error: "Failed to fetch medical record" });
  }
});

// ✅ Delete a medical record
router.delete("/record/:recordId", async (req, res) => {
  try {
    const { recordId } = req.params;
    const medicalRecord = await MedicalRecord.findByIdAndDelete(recordId);

    if (!medicalRecord) {
      return res.status(404).json({ error: "Medical record not found" });
    }

    res.json({ message: "Medical record deleted successfully" });
  } catch (err) {
    console.error("❌ Error in DELETE /medical/record/:recordId:", err);
    res.status(500).json({ error: "Failed to delete medical record" });
  }
});

export default router;