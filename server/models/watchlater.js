import mongoose from "mongoose";

const watchLaterSchema = new mongoose.Schema(
  {
    // FIX: Change 'user' to 'viewer' for consistency across all interaction models
    viewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // FIX: Change 'videoId' to 'videoid' (lowercase 'i') to match History/Like/Dislike
    videoid: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    
    savedOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("WatchLater", watchLaterSchema);