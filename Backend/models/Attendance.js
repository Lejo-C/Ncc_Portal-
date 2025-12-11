const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, enum: ["event", "parade"], required: true },
  records: [
    {
      cadetId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      present: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
