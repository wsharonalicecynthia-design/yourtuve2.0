import express from "express";
import mongoose from "mongoose";

import History from "../models/history.js";
import Video from "../models/video.js";

const router = express.Router();


/*
==================================================
GET WATCH HISTORY
GET /history/:userId
==================================================
*/

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("\n=================================");
    console.log("GET WATCH HISTORY");
    console.log("User ID:", userId);
    console.log("=================================");

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("INVALID USER ID:", userId);

      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const history = await History.find({
      viewer: userId,
    })
      .sort({
        watchedon: -1,
      })
      .lean();

    console.log(
      "RAW HISTORY RECORDS:",
      history.length
    );

    const result = [];

    for (const item of history) {
      const video = await Video.findById(
        item.videoid
      ).lean();

      if (!video) {
        console.log(
          "VIDEO NOT FOUND FOR HISTORY:",
          item.videoid
        );

        continue;
      }

      result.push({
        _id: String(item._id),
        viewer: String(item.viewer),
        videoid: String(item.videoid),

        watchedon: item.watchedon,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,

        video: {
          ...video,
          _id: String(video._id),
        },
      });
    }

    console.log(
      "HISTORY FOUND:",
      result.length
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error(
      "GET HISTORY ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch history",
      error: error.message,
    });
  }
});


/*
==================================================
ADD VIDEO TO HISTORY
POST /history
==================================================
*/

router.post("/", async (req, res) => {
  try {
    const {
      viewer,
      videoid,
    } = req.body;

    console.log("\n=================================");
    console.log("ADD VIDEO TO HISTORY");
    console.log("Viewer:", viewer);
    console.log("Video:", videoid);
    console.log("=================================");


    /*
      CHECK VIEWER
    */

    if (!viewer) {
      console.log(
        "HISTORY ERROR: Viewer missing"
      );

      return res.status(400).json({
        message: "Viewer ID is required",
      });
    }


    /*
      CHECK VIDEO
    */

    if (!videoid) {
      console.log(
        "HISTORY ERROR: Video missing"
      );

      return res.status(400).json({
        message: "Video ID is required",
      });
    }


    /*
      VALIDATE VIEWER OBJECT ID
    */

    if (
      !mongoose.Types.ObjectId.isValid(
        String(viewer)
      )
    ) {
      console.log(
        "HISTORY ERROR: Invalid viewer ID:",
        viewer
      );

      return res.status(400).json({
        message: "Invalid viewer ID",
      });
    }


    /*
      VALIDATE VIDEO OBJECT ID
    */

    if (
      !mongoose.Types.ObjectId.isValid(
        String(videoid)
      )
    ) {
      console.log(
        "HISTORY ERROR: Invalid video ID:",
        videoid
      );

      return res.status(400).json({
        message: "Invalid video ID",
      });
    }


    /*
      CHECK VIDEO EXISTS
    */

    const video = await Video.findById(
      videoid
    );

    if (!video) {
      console.log(
        "HISTORY ERROR: Video not found:",
        videoid
      );

      return res.status(404).json({
        message: "Video not found",
      });
    }


    /*
      CHECK IF ALREADY IN HISTORY
    */

    const existing =
      await History.findOne({
        viewer: viewer,
        videoid: videoid,
      });


    /*
      UPDATE EXISTING HISTORY
    */

    if (existing) {
      existing.watchedon =
        new Date();

      await existing.save();

      console.log(
        "HISTORY UPDATED:",
        existing._id
      );

      return res.status(200).json({
        message:
          "History updated successfully",

        history: {
          ...existing.toObject(),
          _id: String(existing._id),
        },
      });
    }


    /*
      CREATE NEW HISTORY
    */

    const history =
      await History.create({
        viewer: viewer,
        videoid: videoid,
        watchedon: new Date(),
      });


    console.log(
      "HISTORY CREATED:",
      history._id
    );


    return res.status(201).json({
      message:
        "Video added to history",

      history: {
        ...history.toObject(),
        _id: String(history._id),
      },
    });

  } catch (error) {
    console.error(
      "ADD HISTORY ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to add video to history",

      error: error.message,
    });
  }
});


/*
==================================================
DELETE ONE HISTORY ITEM
DELETE /history/:historyId
==================================================
*/

router.delete(
  "/:historyId",
  async (req, res) => {
    try {
      const { historyId } =
        req.params;

      console.log(
        "DELETE HISTORY:",
        historyId
      );

      if (
        !mongoose.Types.ObjectId.isValid(
          historyId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid history ID",
        });
      }

      const deleted =
        await History.findByIdAndDelete(
          historyId
        );

      if (!deleted) {
        return res.status(404).json({
          message:
            "History item not found",
        });
      }

      return res.status(200).json({
        message:
          "History item removed",
      });

    } catch (error) {
      console.error(
        "DELETE HISTORY ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to remove history item",

        error: error.message,
      });
    }
  }
);


/*
==================================================
CLEAR USER HISTORY
DELETE /history/user/:userId
==================================================
*/

router.delete(
  "/user/:userId",
  async (req, res) => {
    try {
      const { userId } =
        req.params;

      console.log(
        "CLEAR HISTORY:",
        userId
      );

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid user ID",
        });
      }

      await History.deleteMany({
        viewer: userId,
      });

      return res.status(200).json({
        message:
          "Watch history cleared",
      });

    } catch (error) {
      console.error(
        "CLEAR HISTORY ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to clear history",

        error: error.message,
      });
    }
  }
);


export default router;