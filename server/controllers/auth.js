// authController.js
import mongoose from "mongoose";
import User from "../models/auth.js";

export const login = async (req, res) => {
  const { email, name, image } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const newUser = await User.create({ email, name, image });
      return res.status(201).json({ result: newUser });
    } else {
      return res.status(200).json({ result: existingUser });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateprofile = async (req, res) => {
  const { id } = req.params;
  const { channelname, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid ID format or User unavailable..." });
  }

  try {
    const updatedData = await User.findByIdAndUpdate(
      id,
      { $set: { channelname, description } },
      { new: true }
    );
    return res.status(200).json({ result: updatedData });
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({ message: "Failed to update profile data" });
  }
};
