const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const User = require("../models/User");


router.post("/", async (req, res) => {
  try {
    const { date, type, records } = req.body;

    const attendanceDoc = new Attendance({ date, type, records });
    await attendanceDoc.save();

    res.status(201).json({ message: "Attendance saved" });
  } catch (err) {
    console.error("❌ Attendance error:", err.message);
    res.status(500).json({ error: "Failed to save attendance" });
  }
});



router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 }).lean();

    // Populate cadet names
    for (let record of records) {
      for (let r of record.records) {
        const cadet = await User.findById(r.cadetId).select("name");
        r.cadetName = cadet?.name || "Unknown";
      }
    }

    res.json(records);
  } catch (err) {
    console.error("❌ Attendance history error:", err.message);
    res.status(500).json({ error: "Failed to fetch attendance history" });
  }
});

router.get("/cadet/:id", async (req, res) => {
  try {
    const cadetId = req.params.id;
    const records = await Attendance.find({ "records.cadetId": cadetId });

    let totalDays = 0;
    let presentDays = 0;
    const history = [];

    for (let record of records) {
      const entry = record.records.find(r => r.cadetId.toString() === cadetId);
      if (entry) {
        totalDays++;
        if (entry.present) presentDays++;
        history.push({
          date: record.date,
          type: record.type,
          present: entry.present
        });
      }
    }

    const percentage = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

    res.json({ totalDays, presentDays, absentDays: totalDays - presentDays, percentage, history });
  } catch (err) {
    console.error("❌ Cadet attendance fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

module.exports = router;
