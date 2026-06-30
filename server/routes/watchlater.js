import express from "express";
import {
    getAllWatchLater,
    handleWatchLater,
} from "../controllers/watchlater.js";

const routes = express.Router();

// Get all watch later videos for a user
routes.get("/:userId", getAllWatchLater);

// Toggle watch later (add/remove) for a video
routes.post("/:videoId", handleWatchLater);

export default routes;
