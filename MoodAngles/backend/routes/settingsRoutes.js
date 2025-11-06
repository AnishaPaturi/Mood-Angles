import express from "express";
import UserSettings from "../models/UserSettings.js";

const router = express.Router();

/**
 * ✅ GET user settings by userId
 * URL: /api/settings/:userId
 */
router.get("/:userId", async (req, res) => {
  try {
    const settings = await UserSettings.findOne({ userId: req.params.userId });
    if (!settings) {
      // Return default settings if user not found
      return res.json({
        userId: req.params.userId,
        darkMode: false,
        notifications: true,
        emailUpdates: true,
        privateAccount: false,
        dailyReminders: true,
        quoteReminders: true,
        feedback: "",
        rating: 0,
      });
    }
    res.json(settings);
  } catch (err) {
    console.error("❌ Error fetching settings:", err.message);
    res.status(500).json({ error: "Server error fetching user settings" });
  }
});

/**
 * ✅ POST or UPDATE user settings
 * URL: /api/settings
 * Body: { userId, darkMode, notifications, emailUpdates, privateAccount, dailyReminders, quoteReminders, feedback, rating }
 */
router.post("/", async (req, res) => {
  try {
    const { userId, ...newSettings } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const updated = await UserSettings.findOneAndUpdate(
      { userId },
      newSettings,
      { new: true, upsert: true }
    );

    console.log(`✅ Settings updated for user: ${userId}`);
    res.json(updated);
  } catch (err) {
    console.error("❌ Error saving settings:", err.message);
    res.status(500).json({ error: "Server error saving user settings" });
  }
});

export default router;
