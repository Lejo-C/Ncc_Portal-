// Force production mode for single-page deployment
process.env.NODE_ENV = 'production';

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const drillVideoRoutes = require("./routes/drillVideo");
const uploadRoute = require("./routes/upload");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const adminRoutes = require("./routes/admin");
const attendanceRoutes = require("./routes/attendance");
const queryRoutes = require("./routes/query");

// Check if all route modules are functions (Express routers)
if (
    typeof drillVideoRoutes !== "function" ||
    typeof uploadRoute !== "function" ||
    typeof authRoutes !== "function" ||
    typeof eventRoutes !== "function"
) {
    throw new Error(
        "One or more route modules are not exporting an Express router. Please check your route files."
    );
}

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
    origin: true,
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/upload", uploadRoute);
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/drill-videos", drillVideoRoutes);
app.use("/api/users", require("./routes/auth"));
app.use("/api/attendance", attendanceRoutes);
app.use("/api/query", queryRoutes);

// Handle favicon.ico requests to prevent 404 warnings
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Serve Frontend (Always in production mode for this file)
const frontendPath = path.join(__dirname, '../Frontend/dist');
console.log('Serving frontend from:', frontendPath);

app.use(express.static(frontendPath));

// Any route that is not an API route should serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n==========================================`);
    console.log(`  NCC Portal - Production Mode  `);
    console.log(`==========================================`);
    console.log(`  Server running on: http://localhost:${PORT}`);
    console.log(`  Frontend + API on same URL!`);
    console.log(`==========================================\n`);
});
