const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const { uploadVideo, getVideos } = require("../controller/videoController");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ✅ This should match the frontend request
router.post("/upload", protect, upload.single("video"), uploadVideo);
router.get("/", protect, getVideos);

module.exports = router;
