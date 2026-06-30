import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
  channelname: { type: String },
  description: { type: String },
});

export default mongoose.model("User", userSchema);
