import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },

    watchedon: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const History =
  mongoose.models.History ||
  mongoose.model("History", historySchema);

export default History;