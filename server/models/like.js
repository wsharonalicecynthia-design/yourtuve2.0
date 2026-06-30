import Like from "../models/like.js";
import Video from "../models/video.js";

// Toggle like/unlike
export const handleLike = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params; // Keep variable name for clarity

  try {
    // FIX: Match the schema field 'videoid'
    const existingLike = await Like.findOne({ viewer: userId, videoid: videoId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      await Video.findByIdAndUpdate(videoId, { $inc: { like: -1 } });
      return res.json({ liked: false });
    } else {
      // FIX: Match the schema field 'videoid'
      await Like.create({ viewer: userId, videoid: videoId });
      await Video.findByIdAndUpdate(videoId, { $inc: { like: 1 } });
      return res.json({ liked: true });
    }
  } catch (error) {
    console.error("Like error:", error);
    return res.json({ message: "Something went wrong" });
  }
};

// Get all liked videos
export const getAllLikeVideo = async (req, res) => {
  const { userId } = req.params;
  try {
    // FIX: Match schema field 'videoid' in the path
    const likedVideos = await Like.find({ viewer: userId })
      .populate({ path: "videoid", model: "VideoFiles" }) 
      .exec();

    return res.status(200).json(likedVideos);
  } catch (error) {
    console.error("Fetch liked videos error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};