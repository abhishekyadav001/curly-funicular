const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const videoRoutes = require("./routes/videoRoutes");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
console.log(path.join(__dirname, "uploads"));
const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Connect to database
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Important for form data
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
