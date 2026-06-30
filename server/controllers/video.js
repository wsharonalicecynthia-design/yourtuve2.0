import Video from "../models/video.js";
export const uploadvideo = async (req, res) => {
  if (!req.file) {
    return res.status(404).json({ message: "Please upload an mp4 video file only" });
  }

  try {
    const file = new Video({
      videotitle: req.body.videotitle,
      filename: req.file.originalname,
      filepath: req.file.path,
      filetype: req.file.mimetype,
      filesize: req.file.size,
      videochannel: req.body.videochannel, // FIX: Corrected spelling
      uploader: req.body.uploader,
    });

    const savedFile = await file.save();
    // Return the new ID so the frontend can redirect to /watch/:id
    return res.status(201).json({ message: "File uploaded successfully", video: savedFile });
  } catch (error) {
    console.error("Video upload error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};