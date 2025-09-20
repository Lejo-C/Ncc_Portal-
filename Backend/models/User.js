const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  regno: {
    type: String,
    required: function () {
      return this.role === "cadet";
    },
    unique: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  rank: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "cadet"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
    name: { type: String, trim: true },
  rank: { type: String, trim: true },
  phone: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
