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

  email: {
    type: String,
    unique: true,
    sparse: true, // allows null for cadets
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ // basic email format
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "cadet"],
    required: true
  }
});

module.exports = mongoose.model("User", UserSchema);
