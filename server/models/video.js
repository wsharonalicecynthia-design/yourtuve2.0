import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  videotitle: { type: String, required: true, trim: true },
  videochannel: { type: String, required: true },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  filetype: { type: String, required: true },
  filesize: { type: Number, required: true },
  uploader: { type: String, required: true },
  uploaderCity: { type: String, default: "Unknown" }, // 🎯 Regional Context
  views: { type: Number, default: 0 },
  like: { type: Number, default: 0 },     // 🎯 Performance: Tracked on model
  dislike: { type: Number, default: 0 },  // 🎯 Performance: Tracked on model
  createdAt: { type: Date, default: Date.now }
});

// 🎯 PERFORMANCE: Index for searching by channel
videoSchema.index({ videochannel: 1 });

export default mongoose.model("Video", videoSchema);