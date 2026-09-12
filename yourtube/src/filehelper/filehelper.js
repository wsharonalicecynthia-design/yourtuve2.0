"use strict";

import multer from "multer";
import fs from "fs";
import path from "path";

// Create uploads folder if it doesn't exist
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// Allow only video files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,

  // 500 MB maximum file size
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
});

export default upload;