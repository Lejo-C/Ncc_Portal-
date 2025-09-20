const express = require("express");
const router = express.Router();
const Cadet = require("../models/Cadet");

router.get("/", async (req, res) => {
  try {
    const cadets = await Cadet.find({ role: "cadet" }).sort({ registeredAt: -1 });
    res.json(cadets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cadets" });
  }
});


module.exports = router;
