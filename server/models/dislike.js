import mongoose from "mongoose";

const dislikeSchema = new mongoose.Schema(
  {
    viewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // FIX: Changed 'videoId' to 'videoid' to match other models
    videoid: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true }, 
    dislikedOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Dislike", dislikeSchema);