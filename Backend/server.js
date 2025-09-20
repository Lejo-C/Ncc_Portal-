const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const drillVideoRoutes = require("./routes/drillVideo");
const uploadRoute = require("./routes/upload");
const cadetRoutes = require("./routes/cadet");
const authRoutes = require("./routes/auth");

dotenv.config();
connectDB(); // ✅ This already connects to MongoDB

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/cadets", cadetRoutes);
app.use("/api/upload", uploadRoute);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/drill-videos", drillVideoRoutes);
app.use("/api/users", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
