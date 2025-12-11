const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");

// GET: Admin dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalCadets = await User.countDocuments({ role: "cadet" });
    const activeEvents = await Event.countDocuments({ date: { $gte: new Date() } });

    // Optional: Add dummy values for now
    const avgAttendance = 92; // Replace with real logic later
    const onLeave = await User.countDocuments({ role: "cadet", status: "leave" }); // if you track leave status

    res.json({ totalCadets, activeEvents, avgAttendance, onLeave });
  } catch (err) {
    console.error("❌ Admin stats error:", err.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
