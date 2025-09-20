require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedUsers = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const users = [
    {
      regno: "TN2024SDIA6910518",
      password: await bcrypt.hash("cadet123", 10),
      role: "cadet"
    },
    {
      regno: "TN2024SWIA6910518",
      password: await bcrypt.hash("cadet123", 10),
      role: "cadet"
    },
    {
      email: "admin@ncc.gov.in",
      password: await bcrypt.hash("admin123", 10),
      role: "admin"
    }
  ];

  try {
    await User.insertMany(users, { ordered: false });
    console.log("✅ Admin and cadet credentials seeded successfully");
  } catch (err) {
    console.error("❌ Insert error:", err);
  }

  mongoose.disconnect();
};

seedUsers();
