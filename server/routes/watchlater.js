import express from "express";
import WatchLater from "../models/watchlater.js";

const router = express.Router();

/*
  GET WATCH LATER VIDEOS
  GET /watchlater/:userId
*/
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Fetching Watch Later for:", userId);

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const watchLater = await WatchLater.find({
      viewer: userId,
    })
      .populate("videoid")
      .sort({ createdAt: -1 })
      .lean();

    console.log(
      "Watch Later videos found:",
      watchLater.length
    );

    const result = watchLater
      .filter((item) => item.videoid)
      .map((item) => ({
        _id: item._id,
        videoid: item.videoid._id,
        viewer: item.viewer,
        watchedon: item.watchedon,
        createdAt: item.createdAt,

        video: item.videoid,
      }));

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "GET WATCH LATER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch Watch Later videos",
      error: error.message,
    });
  }
});


/*
  ADD VIDEO TO WATCH LATER
  POST /watchlater
*/
router.post("/", async (req, res) => {
  try {
    const { viewer, videoid } = req.body;

    console.log("Add Watch Later:", {
      viewer,
      videoid,
    });

    if (!viewer || !videoid) {
      return res.status(400).json({
        message: "Viewer and video ID are required",
      });
    }

    const existing = await WatchLater.findOne({
      viewer,
      videoid,
    });

    if (existing) {
      return res.status(200).json({
        message: "Video already in Watch Later",
        watchLater: existing,
      });
    }

    const watchLater = new WatchLater({
      viewer,
      videoid,
    });

    const saved = await watchLater.save();

    return res.status(201).json({
      message: "Video added to Watch Later",
      watchLater: saved,
    });
  } catch (error) {
    console.error(
      "ADD WATCH LATER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to add video to Watch Later",
      error: error.message,
    });
  }
});


/*
  REMOVE VIDEO FROM WATCH LATER
  DELETE /watchlater/:id
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(
      "Removing Watch Later item:",
      id
    );

    const deleted =
      await WatchLater.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Watch Later item not found",
      });
    }

    return res.status(200).json({
      message: "Removed from Watch Later",
    });
  } catch (error) {
    console.error(
      "REMOVE WATCH LATER ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to remove Watch Later item",
      error: error.message,
    });
  }
});

export default router;