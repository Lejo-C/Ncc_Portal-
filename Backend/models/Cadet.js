const mongoose = require("mongoose");

const CadetSchema = new mongoose.Schema({
  name: String,
  rank: String,
  email: String,
  phone: String,
  role: { type: String, default: "cadet" },
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cadet", CadetSchema);
