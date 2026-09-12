import mongoose from "mongoose";

const dislikeSchema = new mongoose.Schema(
  {
    viewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    videoid: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true }, 
    dislikedOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 🎯 PERFORMANCE: Prevent duplicate dislikes and speed up lookups
dislikeSchema.index({ viewer: 1, videoid: 1 }, { unique: true });

export default mongoose.model("Dislike", dislikeSchema);