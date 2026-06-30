import Video from "../models/video.js";
import History from "../models/history.js";

export const getAllHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    // FIX: 'path' must match the field name defined in history.js schema
    // FIX: 'model' must match the export name in video.js
    const historyVideo = await History.find({ viewer: userId }).populate({
      path: "videoid", 
      model: "Video" 
    });
    res.status(200).json(historyVideo);
  } catch (error) {
    console.error("Fetch history error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};