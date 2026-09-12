import History from "../models/history.js";

// ===============================
// GET USER WATCH HISTORY
// ===============================
export const getAllHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const historyVideo = await History.find({
      viewer: userId,
    })
      .populate({
        path: "videoid",
        model: "Video",
      })
      .sort({ watchedon: -1 });

    // Remove history records for deleted videos
    const activeHistory = historyVideo.filter(
      (item) => item.videoid !== null
    );

    // Convert videoid → video
    // This matches your frontend HistoryContentComponent
    const formattedHistory = activeHistory.map((item) => ({
      _id: item._id,
      videoid: item.videoid._id,
      viewer: item.viewer,
      watchedon: item.watchedon,
      video: item.videoid,
    }));

    return res.status(200).json(formattedHistory);
  } catch (error) {
    console.error("Fetch history error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
