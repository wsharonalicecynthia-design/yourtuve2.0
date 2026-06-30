export const handleWatchLater = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;

  try {
    // FIX: Match schema fields 'viewer' and 'videoid'
    const existingWatchLater = await WatchLater.findOne({ viewer: userId, videoid: videoId });

    if (existingWatchLater) {
      await WatchLater.findByIdAndDelete(existingWatchLater._id);
      return res.status(200).json({ watchlater: false });
    } else {
      // FIX: Match schema fields 'viewer' and 'videoid'
      await WatchLater.create({ viewer: userId, videoid: videoId });
      return res.status(200).json({ watchlater: true });
    }
  } catch (error) {
    console.error("Watch Later error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllWatchLater = async (req, res) => {
  const { userId } = req.params;
  try {
    // FIX: Match schema field 'viewer'
    const watchLaterVideos = await WatchLater.find({ viewer: userId })
      // FIX: 'path' must match 'videoid' and 'model' must match your video model export
      .populate({ path: "videoid", model: "Video" }) 
      .exec();

    return res.status(200).json(watchLaterVideos);
  } catch (error) {
    console.error("Watch Later fetch error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};