// dislikeController.js
import Dislike from "../models/dislike.js";
import Video from "../models/video.js";

export const handleDislike = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params; // Make sure your route uses :videoId

  try {
    // FIX: Match the schema field 'viewer' and 'videoid'
    const existingDislike = await Dislike.findOne({ viewer: userId, videoid: videoId });

    if (existingDislike) {
      await Dislike.findByIdAndDelete(existingDislike._id);
      await Video.findByIdAndUpdate(videoId, { $inc: { dislike: -1 } });
      return res.json({ disliked: false });
    } else {
      // FIX: Use 'videoid' here too
      await Dislike.create({ viewer: userId, videoid: videoId });
      await Video.findByIdAndUpdate(videoId, { $inc: { dislike: 1 } });
      return res.json({ disliked: true });
    }
  } catch (error) {
    console.error("Dislike error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};