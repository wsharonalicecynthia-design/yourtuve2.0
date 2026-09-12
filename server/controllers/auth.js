import mongoose from "mongoose";
import User from "../models/auth.js";

// ===============================
// LOGIN / REGISTER
// ===============================
export const login = async (req, res) => {
  try {
    const { email, name, image } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        message: "Email and name are required.",
      });
    }

    // Check whether user already exists
    let existingUser = await User.findOne({ email });

    // Create new user if one doesn't exist
    if (!existingUser) {
      try {
        existingUser = await User.create({
          email,
          name,
          image: image || "",
        });

        return res.status(201).json({
          result: existingUser,
        });
      } catch (error) {
        // Handle simultaneous login requests
        if (error.code === 11000) {
          existingUser = await User.findOne({ email });
        } else {
          throw error;
        }
      }
    }

    // Update Google profile information
    existingUser.name = name;

    if (image) {
      existingUser.image = image;
    }

    await existingUser.save();

    return res.status(200).json({
      result: existingUser,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
export const updateprofile = async (req, res) => {
  try {
    const { id } = req.params;
    const { channelname, description } = req.body;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    // Update profile
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          channelname: channelname || "",
          description: description || "",
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      result: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Failed to update profile.",
    });
  }
};