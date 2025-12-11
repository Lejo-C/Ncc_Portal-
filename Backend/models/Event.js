const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String, required: true },
  participants: { type: Number },
  status: { type: String, default: "Planning" }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
