const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  postedBy: {
    name: String,
    role: String, // "Cadet", "Admin"
    cadetId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  status: { type: String, default: "Unsolved" }, // or "Solved"
  views: { type: Number, default: 0 },
  answers: [
    {
      responder: String,
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Query", querySchema);
