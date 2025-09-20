// routes/drillVideo.js
const express = require("express");
const router = express.Router();
const DrillVideo = require("../models/DrillVideo");

// Upload video metadata
router.post("/upload", async (req, res) => {
  const { title, videoUrl } = req.body;
  try {
    const newVideo = new DrillVideo({ title, videoUrl });
    await newVideo.save();
    res.status(200).json({ message: "Video uploaded", video: newVideo });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

// Get all videos
router.get("/", async (req, res) => {
  try {
    const videos = await DrillVideo.find().sort({ uploadedAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// Delete video by ID
router.delete("/:id", async (req, res) => {
  try {
    await DrillVideo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete video" });
  }
});


module.exports = router;
