const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");
const authMiddleware = require("../utils/authMiddleware");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const { tokenStore } = require("../utils/sendVerificationEmail");
const Event = require("../models/Event");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { regno, name, password, role } = req.body;
    if (!regno || !name || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ regno, name, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Reg No already exists" });
    }
    console.error("❌ Registration error:", err.message);
    res.status(500).json({ error: "Failed to register user" });
  }
});


// Login - accepts both regno (for cadets) and email (for admins)
router.post("/login", async (req, res) => {
  const { regno, email, password } = req.body;

  try {
    // Find user by regno (cadets) or email (admins)
    let user;
    if (regno) {
      user = await User.findOne({ regno });
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      return res.status(400).json({ message: "Please provide regno or email" });
    }

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Create session in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // 1 day expiry

    // Remove any existing sessions for this user (optional, for single device login)
    // await Session.deleteMany({ userId: user._id });

    const session = new Session({
      userId: user._id,
      token,
      role: user.role,
      expiresAt
    });
    await session.save();

    // Return token only, frontend will fetch user data separately
    res.json({
      token,
      role: user.role,
      message: "Login successful"
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user (replaces localStorage.getItem("cadet"))
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // User is already loaded by authMiddleware
    res.json(req.user);
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout (invalidate session)
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    // Delete the session from database
    await Session.deleteOne({ token: req.session.token });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    // Use authenticated user ID from middleware
    const updated = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).select("-password");

    if (email) await sendVerificationEmail(email);

    res.json(updated);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Get cadet by ID
router.get("/cadet/:id", async (req, res) => {
  try {
    const cadet = await User.findById(req.params.id);
    if (!cadet || cadet.role !== "cadet") {
      return res.status(404).json({ message: "Cadet not found" });
    }
    res.json(cadet);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Verify email
router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;
  const email = tokenStore[token];
  if (!email) return res.status(400).send("Invalid or expired token");

  await User.findOneAndUpdate({ email }, { isEmailVerified: true });
  delete tokenStore[token];
  res.send("✅ Email verified successfully. You can close this tab.");
});

// Send email verification
router.post("/send-email-verification", async (req, res) => {
  try {
    const { email } = req.body;
    await sendVerificationEmail(email);
    res.json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send verification email" });
  }
});

router.get("/cadets", async (req, res) => {
  try {
    const cadets = await User.find({ role: "cadet" }).sort({ createdAt: -1 });
    res.json(cadets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cadets" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Cadet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete cadet" });
  }
});

router.put("/update-rank/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { rank: req.body.rank },
      { new: true }
    );
    res.json({ message: "Rank updated", user: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update rank" });
  }
});

router.get("/cadets", async (req, res) => {
  try {
    const cadets = await User.find({ role: "cadet" }).sort({ createdAt: -1 });
    res.json(cadets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cadets" });
  }
});


module.exports = router;



