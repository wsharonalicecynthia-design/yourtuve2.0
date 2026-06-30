import Like from "../models/like.js";
import Video from "../models/video.js";

// Toggle like/unlike
export const handleLike = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params; // Keep req.params as videoId, just map it correctly below

  try {
    if (!userId || !videoId) {
      return res.status(400).json({ message: "Missing userId or videoId" });
    }

    // FIX: Match the schema field name 'videoid'
    const existingLike = await Like.findOne({ viewer: userId, videoid: videoId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      await Video.findByIdAndUpdate(videoId, { $inc: { like: -1 } });
      return res.json({ liked: false });
    } else {
      // FIX: Match the schema field name 'videoid'
      await Like.create({ viewer: userId, videoid: videoId });
      await Video.findByIdAndUpdate(videoId, { $inc: { like: 1 } });
      return res.json({ liked: true });
    }
  } catch (error) {
    console.error("Like error:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Get all liked videos
export const getAllLikeVideo = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    // FIX: Match the schema field name 'videoid' in the populate path
    const likedVideos = await Like.find({ viewer: userId })
      .populate({ path: "videoid", model: "Video" }) 
      .exec();

    return res.status(200).json(likedVideos);
  } catch (error) {
    console.error("Fetch liked videos error:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};