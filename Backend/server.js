const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { fileURLToPath } = require("url");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


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
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || true
    : 'http://localhost:5173',
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


// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../Frontend/dist')));

  // Any route that is not an API route should serve the frontend
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running... Frontend is on http://localhost:5173');
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
