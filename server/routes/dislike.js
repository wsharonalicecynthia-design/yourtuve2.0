import express from "express";
import { handleDislike } from "../controllers/dislike.js";


const router = express.Router();

// Toggle dislike/un-dislike
router.post("/:videoId", handleDislike);

export default router;
