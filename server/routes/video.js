import express from "express";
import upload from "../middleware/upload.js";
import Video from "../models/video.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(
  __dirname,
  "..",
  "uploads"
);

/* =====================================================
   UPLOAD VIDEO
===================================================== */

router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No video file uploaded",
        });
      }

      const {
        videotitle,
        videochannel,
        uploader,
        city,
      } = req.body;

      if (
        !videotitle ||
        !videochannel ||
        !uploader
      ) {
        return res.status(400).json({
          message:
            "Video title, channel, and uploader are required",
        });
      }

      const titleRegex =
        /^[a-zA-Z0-9\s.,!?'"()\-]+$/;

      if (
        !titleRegex.test(
          videotitle.trim()
        )
      ) {
        return res.status(400).json({
          message: "Invalid video title",
        });
      }

      const video = new Video({
        videotitle: videotitle.trim(),

        videochannel:
          videochannel.trim(),

        filename: req.file.filename,

        filepath:
          `/uploads/${req.file.filename}`,

        filetype:
          req.file.mimetype,

        filesize:
          req.file.size,

        uploader,

        uploaderCity:
          city || "Unknown",

        views: 0,

        like: 0,

        dislike: 0,
      });

      const savedVideo =
        await video.save();

      console.log(
        "VIDEO SAVED:",
        savedVideo
      );

      return res.status(201).json({
        message:
          "Video uploaded successfully",

        video: savedVideo,
      });
    } catch (error) {
      console.error(
        "UPLOAD ERROR:",
        error
      );

      return res.status(500).json({
        message: "Upload failed",
        error: error.message,
      });
    }
  }
);

/* =====================================================
   GET ALL VIDEOS
===================================================== */

router.get(
  "/getall",
  async (req, res) => {
    try {
      const videos =
        await Video.find()
          .sort({
            createdAt: -1,
          });

      return res.status(200).json(
        videos
      );
    } catch (error) {
      console.error(
        "FETCH VIDEOS ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch videos",

        error:
          error.message,
      });
    }
  }
);

/* =====================================================
   STREAM VIDEO
===================================================== */

router.get(
  "/stream/:videoId",
  async (req, res) => {
    try {
      const video =
        await Video.findById(
          req.params.videoId
        );

      if (!video) {
        return res.status(404).json({
          message: "Video not found",
        });
      }

      if (!video.filename) {
        return res.status(404).json({
          message:
            "Video file not found in database",
        });
      }

      const filePath =
        path.join(
          uploadsPath,
          video.filename
        );

      console.log(
        "STREAM REQUEST:"
      );

      console.log(
        "Filename:",
        video.filename
      );

      console.log(
        "File path:",
        filePath
      );

      if (
        !fs.existsSync(filePath)
      ) {
        console.error(
          "FILE DOES NOT EXIST:",
          filePath
        );

        return res.status(404).json({
          message:
            "Video file does not exist on server",
        });
      }

      res.sendFile(filePath);
    } catch (error) {
      console.error(
        "STREAM VIDEO ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to stream video",

        error:
          error.message,
      });
    }
  }
);

/* =====================================================
   GET SINGLE VIDEO
===================================================== */

router.get(
  "/:videoId",
  async (req, res) => {
    try {
      const video =
        await Video.findById(
          req.params.videoId
        );

      if (!video) {
        return res.status(404).json({
          message:
            "Video not found",
        });
      }

      return res.status(200).json(
        video
      );
    } catch (error) {
      console.error(
        "FETCH VIDEO ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch video",

        error:
          error.message,
      });
    }
  }
);

export default router;