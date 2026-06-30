import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    viewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // FIX: Change 'videoId' to 'videoid' to match all other interaction models
    videoid: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    likedOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Like", likeSchema);