import mongoose from "mongoose";

const watchLaterSchema = new mongoose.Schema(
  {
    viewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    videoid: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    savedOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 🎯 PERFORMANCE: Ensure each user can only save a specific video once
watchLaterSchema.index({ viewer: 1, videoid: 1 }, { unique: true });

export default mongoose.model("WatchLater", watchLaterSchema);