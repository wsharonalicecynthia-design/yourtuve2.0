import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  // Use ObjectId to link to the User model
  viewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // FIX: Changed 'videoId' to 'videoid' to match your other controllers
  videoid: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  
  watchedon: { type: Date, default: Date.now }
});

export default mongoose.model("History", historySchema);