import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import History from '../models/history.js';
import Video from '../models/video.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Upload Route → saves video metadata in MongoDB
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const video = new Video({
      videotitle: req.body.videotitle || req.file.originalname,
      videochannel: req.body.videochannel || "Default Channel",
      filename: req.file.filename,
      views: 0,
      createdAt: new Date()
    });

    await video.save();
    res.status(201).json(video); // return full video doc with _id
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// Get all videos → Home page
router.get("/getall", async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch videos", error: err.message });
  }
});

// ... imports
// (Make sure you have your models imported correctly)

// Play Route → streams video + logs history
router.get("/play/:videoId/:userId", async (req, res) => {
  try {
    const videoDoc = await Video.findById(req.params.videoId);
    if (!videoDoc) return res.status(404).send("Video not found");

    // FIX: Match the 'videoid' field name (lowercase 'i') 
    // to match your History.js schema
    await History.create({ viewer: req.params.userId, videoid: videoDoc._id });
    await Video.findByIdAndUpdate(videoDoc._id, { $inc: { views: 1 } });

    // ... rest of streaming logic (remains the same)
    const videoPath = path.join(__dirname, '../uploads', videoDoc.filename);
    // ...
  } catch (err) {
    console.error("Play route error:", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});
export default router;
