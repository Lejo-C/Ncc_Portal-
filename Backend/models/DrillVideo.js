// models/DrillVideo.js
const mongoose = require("mongoose");

const DrillVideoSchema = new mongoose.Schema({
  title: String,
  views: { type: Number, default: 0 },
  videoUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DrillVideo", DrillVideoSchema);
