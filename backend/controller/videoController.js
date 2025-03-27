const Video = require("../models/Video");
const path = require("path");

const uploadVideo = async (req, res) => {
  const { title, description, tags } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "No file uploaded" });

  const video = new Video({
    userId: req.user.id,
    title,
    description,
    tags: tags ? tags.split(",") : [],
    fileSize: file.size,
    duration: Math.floor(Math.random() * 300), // Random duration for demo
    filePath: file.path,
  });

  try {
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { uploadVideo, getVideos };
