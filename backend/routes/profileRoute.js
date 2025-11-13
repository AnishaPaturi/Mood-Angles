import express from "express";
import User from "../models/User.js"; // ✅ Ensure correct path and casing

const router = express.Router();

// ✅ Get user profile by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("❌ Error in GET /:id:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update user profile (first name, last name, etc.)
router.put("/update/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("❌ Error in PUT /update:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// ✅ Upload profile photo (base64)
router.put("/uploadPhoto/:id", async (req, res) => {
  try {
    const { profilePic } = req.body;

    console.log("📸 Upload request for user:", req.params.id);

    if (!profilePic) {
      console.warn("⚠️ No image provided in request body");
      return res.status(400).json({ error: "No image provided" });
    }

    // 🔥 Fix: Update correct field name from schema
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profilePhoto: profilePic },
      { new: true }
    ).select("-password");

    if (!user) {
      console.warn("⚠️ No user found for ID:", req.params.id);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Profile photo updated for:", user.email);
    res.json({ message: "Photo updated successfully", user });
  } catch (err) {
    console.error("❌ Error in /uploadPhoto:", err);
    res.status(500).json({ error: "Photo upload failed", details: err.message });
  }
});

// 🌤️ ✅ Save mood history (new)
router.put("/mood/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { moodHistory } = req.body;

    if (!Array.isArray(moodHistory)) {
      return res.status(400).json({ error: "moodHistory must be an array" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { moodHistory },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(`✅ Mood history updated for ${user.email}`);
    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Error in PUT /mood:", err);
    res.status(500).json({ error: "Failed to update mood history" });
  }
});

export default router;
