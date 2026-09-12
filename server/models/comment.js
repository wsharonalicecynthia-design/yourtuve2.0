import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
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

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    city: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "en",
    },

    likes: {
      type: [
        mongoose.Schema.Types.ObjectId,
      ],
      default: [],
    },

    dislikes: {
      type: [
        mongoose.Schema.Types.ObjectId,
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Comment =
  mongoose.models.Comment ||
  mongoose.model(
    "Comment",
    commentSchema
  );

export default Comment;