import express from "express";
import mongoose from "mongoose";

import Comment from "../models/comment.js";
import Auth from "../models/auth.js";

const router = express.Router();

/*
  GET ALL COMMENTS
  GET /comment/:videoId
*/
router.get("/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({
        message: "Video ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({
        message: "Invalid video ID",
      });
    }

    const comments = await Comment.find({
      videoid: videoId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const result = await Promise.all(
      comments.map(async (item) => {
        let user = null;

        if (
          item.viewer &&
          mongoose.Types.ObjectId.isValid(
            String(item.viewer)
          )
        ) {
          user = await Auth.findById(
            item.viewer
          )
            .select("_id name email image")
            .lean();
        }

        return {
          ...item,

          viewer: user || {
            _id: item.viewer,
            name: "User",
            email: "",
            image: "",
          },

          commentbody: item.comment,
          usercommented:
            user?.name || "User",
          userid: item.viewer,
          userimage:
            user?.image || "",
          city: item.city || "",
          language:
            item.language || "en",
          likes:
            item.likes || [],
          dislikes:
            item.dislikes || [],
        };
      })
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "GET COMMENTS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
});


/*
  ADD COMMENT
  POST /comment
*/
router.post("/", async (req, res) => {
  try {
    console.log(
      "=============================="
    );
    console.log("POST COMMENT");
    console.log("BODY:", req.body);
    console.log(
      "=============================="
    );

    let viewer =
      req.body.viewer ||
      req.body.viewerId ||
      req.body.userid ||
      req.body.userId;

    let videoid =
      req.body.videoid ||
      req.body.videoId;

    let comment =
      req.body.comment ||
      req.body.commentbody ||
      req.body.text;

    /*
      Handle object user
    */

    if (
      viewer &&
      typeof viewer === "object"
    ) {
      viewer =
        viewer._id ||
        viewer.id;
    }

    /*
      Handle object video
    */

    if (
      videoid &&
      typeof videoid === "object"
    ) {
      videoid =
        videoid._id ||
        videoid.id;
    }

    viewer =
      viewer !== undefined &&
      viewer !== null
        ? String(viewer)
        : "";

    videoid =
      videoid !== undefined &&
      videoid !== null
        ? String(videoid)
        : "";

    comment =
      comment !== undefined &&
      comment !== null
        ? String(comment).trim()
        : "";

    console.log(
      "FINAL VIEWER:",
      viewer
    );

    console.log(
      "FINAL VIDEO:",
      videoid
    );

    console.log(
      "FINAL COMMENT:",
      comment
    );

    /*
      Validate
    */

    if (!viewer) {
      return res.status(400).json({
        message:
          "Viewer ID is required",
      });
    }

    if (!videoid) {
      return res.status(400).json({
        message:
          "Video ID is required",
      });
    }

    if (!comment) {
      return res.status(400).json({
        message:
          "Comment cannot be empty",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        viewer
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid viewer ID",
        viewer,
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        videoid
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid video ID",
        videoid,
      });
    }

    /*
      SAVE COMMENT
    */

    const newComment =
      await Comment.create({
        viewer: viewer,
        videoid: videoid,
        comment: comment,
      });

    console.log(
      "COMMENT SAVED:",
      newComment._id
    );

    /*
      Get user information
    */

    let user = null;

    try {
      user = await Auth.findById(
        viewer
      )
        .select(
          "_id name email image"
        )
        .lean();
    } catch (error) {
      console.log(
        "USER LOOKUP FAILED:",
        error.message
      );
    }

    /*
      Response
    */

    return res.status(201).json({
      message:
        "Comment added successfully",

      comment: {
        ...newComment.toObject(),

        viewer: user || {
          _id: viewer,
          name: "User",
          email: "",
          image: "",
        },

        commentbody: comment,

        usercommented:
          user?.name || "User",

        userid: viewer,

        userimage:
          user?.image || "",
      },
    });
  } catch (error) {
    console.error(
      "POST COMMENT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to add comment",
      error: error.message,
    });
  }
});


/*
  DELETE COMMENT
  DELETE /comment/:commentId
*/
router.delete(
  "/:commentId",
  async (req, res) => {
    try {
      const { commentId } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          commentId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid comment ID",
        });
      }

      const deleted =
        await Comment.findByIdAndDelete(
          commentId
        );

      if (!deleted) {
        return res.status(404).json({
          message:
            "Comment not found",
        });
      }

      return res.status(200).json({
        message:
          "Comment deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE COMMENT ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to delete comment",
        error: error.message,
      });
    }
  }
);


export default router;