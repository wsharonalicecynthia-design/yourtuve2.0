import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  videotitle: { type: String, required: true },
  videochannel: { type: String, required: true }, // Matches your controller's corrected spelling
  filename: { type: String, required: true },
  filepath: { type: String, required: true },     // Added missing field
  filetype: { type: String, required: true },     // Added missing field
  filesize: { type: Number, required: true },     // Added missing field
  uploader: { type: String, required: true },     // Added missing field
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Video", videoSchema);