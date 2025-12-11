const express = require("express");
const router = express.Router();
const Query = require("../models/Query");

// POST: Create a new query
router.post("/", async (req, res) => {
  try {
    const query = new Query(req.body);
    await query.save();
    res.status(201).json({ message: "Query posted", query });
  } catch (err) {
    console.error("❌ Query creation error:", err.message);
    res.status(500).json({ error: "Failed to post query" });
  }
});

// GET: Fetch all queries
router.get("/", async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error("❌ Query fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch queries" });
  }
});

// POST: Add an answer to a query
router.post("/answer/:id", async (req, res) => {
  try {
    const { responder, text } = req.body;
    const query = await Query.findById(req.params.id);
    query.answers.push({ responder, text });
    await query.save();
    res.json({ message: "Answer added", query });
  } catch (err) {
    res.status(500).json({ error: "Failed to post answer" });
  }
});

// PUT: Mark query as solved
router.put("/solve/:id", async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(req.params.id, { status: "Solved" }, { new: true });
    res.json({ message: "Query marked as solved", query });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});



module.exports = router;
