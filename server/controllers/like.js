import Like from "../models/like.js";
import Dislike from "../models/dislike.js";
import Video from "../models/video.js";

// ===============================
// TOGGLE LIKE / UNLIKE
// ===============================
export const handleLike = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;

  try {
    if (!userId || !videoId) {
      return res.status(400).json({
        message: "Missing userId or videoId",
      });
    }

    // Check whether video exists
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Check existing like
    const existingLike = await Like.findOne({
      viewer: userId,
      videoid: videoId,
    });

    // ===============================
    // REMOVE LIKE
    // ===============================
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);

      const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
          $inc: { like: -1 },
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        liked: false,
        currentLikes: Math.max(updatedVideo.like, 0),
      });
    }

    // ===============================
    // REMOVE DISLIKE
    // ===============================
    const existingDislike = await Dislike.findOne({
      viewer: userId,
      videoid: videoId,
    });

    if (existingDislike) {
      await Dislike.findByIdAndDelete(existingDislike._id);

      await Video.findByIdAndUpdate(videoId, {
        $inc: { dislike: -1 },
      });
    }

    // ===============================
    // ADD LIKE
    // ===============================
    await Like.create({
      viewer: userId,
      videoid: videoId,
    });

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $inc: { like: 1 },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      liked: true,
      currentLikes: updatedVideo.like,
    });
  } catch (error) {
    console.error("Like error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// ===============================
// GET ALL LIKED VIDEOS
// ===============================
export const getAllLikeVideo = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({
        message: "Missing userId",
      });
    }

    const likedVideos = await Like.find({
      viewer: userId,
    })
      .populate({
        path: "videoid",
        model: "Video",
      })
      .sort({ createdAt: -1 });

    // Remove records for deleted videos
    const activeLikedVideos = likedVideos.filter(
      (item) => item.videoid !== null
    );

    return res.status(200).json(activeLikedVideos);
  } catch (error) {
    console.error("Fetch liked videos error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};