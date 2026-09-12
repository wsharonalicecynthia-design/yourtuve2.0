import express from "express";
import Auth from "../models/auth.js";
import Video from "../models/video.js";

const router = express.Router();

/*
  GET CHANNEL + CHANNEL VIDEOS

  GET /channel/:id
*/
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Fetching channel:", id);

    if (!id) {
      return res.status(400).json({
        message: "Channel ID is required",
      });
    }

    // Find user/channel
    const channel = await Auth.findById(id).lean();

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found",
      });
    }

    // Find videos uploaded by this user
    const videos = await Video.find({
      uploader: id,
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log(
      "Channel found:",
      channel.channelname || channel.name
    );

    console.log(
      "Channel videos:",
      videos.length
    );

    return res.status(200).json({
      channel: {
        _id: channel._id,
        channelname:
          channel.channelname ||
          channel.name ||
          "Your Channel",
        description:
          channel.description || "",
        email: channel.email || "",
      },
      videos,
    });
  } catch (error) {
    console.error(
      "GET CHANNEL ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to load channel",
      error: error.message,
    });
  }
});

export default router;