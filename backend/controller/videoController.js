const Video = require("../models/Video");
const path = require("path");

const uploadVideo = async (req, res) => {
  console.log("Upload request received:", req.file, req.body);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { title, description, tags } = req.body;
  const filePath = path.join("uploads", req.file.filename); // Store relative path

  const video = new Video({
    userId: req.user.id,
    title,
    description,
    tags: tags ? tags.split(",") : [],
    fileSize: req.file.size,
    duration: Math.floor(Math.random() * 300), // Random duration for demo
    filePath,
  });

  try {
    await video.save();
    res.status(201).json({ message: "Video uploaded successfully", video });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getVideos = async (req, res) => {
  const { page = 1, limit = 10, title, tags } = req.query;
  const query = { userId: req.user.id };

  if (title) query.title = { $regex: title, $options: "i" };
  if (tags) query.tags = { $in: tags.split(",") };

  try {
    const videos = await Video.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ uploadedAt: -1 });

    const total = await Video.countDocuments(query);

    res.json({ videos, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Fetch Videos Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { uploadVideo, getVideos };
