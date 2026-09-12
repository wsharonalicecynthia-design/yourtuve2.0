import Dislike from "../models/dislike.js";
import Like from "../models/like.js";
import Video from "../models/video.js";

// ===============================
// TOGGLE DISLIKE
// ===============================
export const handleDislike = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    // Check if video exists
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // Check existing dislike
    const existingDislike = await Dislike.findOne({
      viewer: userId,
      videoid: videoId,
    });

    if (existingDislike) {
      // ===============================
      // REMOVE DISLIKE
      // ===============================
      await Dislike.findByIdAndDelete(existingDislike._id);

      const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
          $inc: {
            dislike: -1,
          },
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        disliked: false,
        currentDislikes: Math.max(
          updatedVideo.dislike,
          0
        ),
      });
    }

    // ===============================
    // REMOVE LIKE FIRST
    // ===============================
    const existingLike = await Like.findOne({
      viewer: userId,
      videoid: videoId,
    });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);

      await Video.findByIdAndUpdate(videoId, {
        $inc: {
          like: -1,
        },
      });
    }

    // ===============================
    // ADD DISLIKE
    // ===============================
    await Dislike.create({
      viewer: userId,
      videoid: videoId,
    });

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $inc: {
          dislike: 1,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      disliked: true,
      currentDislikes: updatedVideo.dislike,
    });
  } catch (error) {
    console.error("Dislike error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};