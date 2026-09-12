import express from "express";
import Like from "../models/like.js";

const router = express.Router();

/*
  GET LIKED VIDEOS FOR A USER
  GET /like/:userId
*/
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Fetching liked videos for:", userId);

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const likes = await Like.find({
      viewer: userId,
    })
      .populate("videoid")
      .sort({ createdAt: -1 })
      .lean();

    console.log("Liked videos found:", likes.length);

    const result = likes
      .filter((like) => like.videoid)
      .map((like) => ({
        _id: like._id,
        viewer: like.viewer,
        videoid: like.videoid._id,
        likedOn: like.likedOn,
        createdAt: like.createdAt,
        video: like.videoid,
      }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("GET LIKED VIDEOS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch liked videos",
      error: error.message,
    });
  }
});


/*
  LIKE A VIDEO
  POST /like
*/
router.post("/", async (req, res) => {
  try {
    const { viewer, videoid } = req.body;

    console.log("Like request:", {
      viewer,
      videoid,
    });

    if (!viewer || !videoid) {
      return res.status(400).json({
        message: "Viewer and video ID are required",
      });
    }

    const existingLike = await Like.findOne({
      viewer,
      videoid,
    });

    if (existingLike) {
      return res.status(200).json({
        message: "Video already liked",
        like: existingLike,
      });
    }

    const newLike = new Like({
      viewer,
      videoid,
    });

    const savedLike = await newLike.save();

    return res.status(201).json({
      message: "Video liked successfully",
      like: savedLike,
    });
  } catch (error) {
    console.error("LIKE VIDEO ERROR:", error);

    return res.status(500).json({
      message: "Failed to like video",
      error: error.message,
    });
  }
});


/*
  REMOVE LIKE
  DELETE /like/:likedId
*/
router.delete("/:likedId", async (req, res) => {
  try {
    const { likedId } = req.params;

    console.log("Removing like:", likedId);

    const deletedLike =
      await Like.findByIdAndDelete(likedId);

    if (!deletedLike) {
      return res.status(404).json({
        message: "Like not found",
      });
    }

    return res.status(200).json({
      message: "Video removed from liked videos",
    });
  } catch (error) {
    console.error("REMOVE LIKE ERROR:", error);

    return res.status(500).json({
      message: "Failed to remove like",
      error: error.message,
    });
  }
});

export default router;