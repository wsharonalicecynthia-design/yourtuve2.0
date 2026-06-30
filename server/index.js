import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import historyRoutes from "./routes/history.js";
import likeRoutes from "./routes/like.js";
import dislikeRoutes from "./routes/dislike.js";
import watchlaterRoutes from "./routes/watchlater.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/history", historyRoutes);
app.use("/like", likeRoutes);
app.use("/dislike", dislikeRoutes);
app.use("/watchlater", watchlaterRoutes);

app.get("/", (req, res) => {
  res.send("YouTube backend is working fine locally");
});

const DBURL = "mongodb://127.0.0.1:27017/youtube";
console.log("Connecting to Database...");

mongoose
  .connect(DBURL)
  .then(() => {
    console.log("🍃 Mongodb connected successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err);
  });
