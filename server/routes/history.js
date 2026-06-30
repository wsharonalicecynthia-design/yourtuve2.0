import express from "express";
import History from "../models/history.js";
import Video from "../models/video.js";

const router = express.Router();

// Log history manually
router.post("/log/:videoId/:userId", async (req, res) => {
  try {
    const videoDoc = await Video.findById(req.params.videoId);
    if (!videoDoc) return res.status(404).send("Video not found");

    // FIX: Match model field 'videoid' (lowercase 'i')
    await History.create({ viewer: req.params.userId, videoid: videoDoc._id });
    await Video.findByIdAndUpdate(videoDoc._id, { $inc: { views: 1 } });

    res.status(201).json({ message: "History logged" });
  } catch (err) {
    console.error("Log history error:", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// Fetch history
router.get("/:userId", async (req, res) => {
  try {
    // FIX: Populate 'videoid' to match the schema field name
    const historyVideo = await History.find({ viewer: req.params.userId })
      .populate("videoid");
    res.status(200).json(historyVideo);
  } catch (error) {
    console.error("Fetch history error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

export default router;