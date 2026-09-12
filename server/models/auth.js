import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    channelname: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    // Required for assignment
    city: {
      type: String,
      default: "Unknown",
    },

    state: {
      type: String,
      default: "",
    },

    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);