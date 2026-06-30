import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, "uploads/");
  },

  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // FIX: Using ISO string is good, but keep it clean
    const uniqueSuffix = new Date().toISOString().replace(/:/g, "-");
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    // Optional: Return an error if the user uploads the wrong file type
    cb(new Error("Only .mp4 files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Optional: Set a file size limit (e.g., 50MB)
});

export default upload;