const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// POST: Create a new event
router.post("/", async (req, res) => {
  try {
    const { title, date, time, location, participants, status, description } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ error: "Title, date, and location are required" });
    }

    const event = new Event({
      title,
      date,
      time,
      location,
      participants,
      status: status || "Planning",
      description
    });

    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    console.error("❌ Event creation error:", err.message);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// DELETE: Remove an event
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("❌ Event deletion error:", err.message);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// GET: Upcoming events
router.get("/upcoming", async (req, res) => {
  try {
    const today = new Date();
    const events = await Event.find({ date: { $gte: today } }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error("❌ Upcoming events fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch upcoming events" });
  }
});

// GET: All events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error("❌ Event fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event updated successfully", event: updated });
  } catch (err) {
    console.error("❌ Event update error:", err.message);
    res.status(500).json({ error: "Failed to update event" });
  }
});



module.exports = router;
