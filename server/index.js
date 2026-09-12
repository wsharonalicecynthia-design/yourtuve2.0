import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import historyRoutes from "./routes/history.js";
import likeRoutes from "./routes/like.js";
import dislikeRoutes from "./routes/dislike.js";
import watchlaterRoutes from "./routes/watchlater.js";
import channelRoutes from "./routes/channel.js";
import commentRoutes from "./routes/comment.js";
import subscriptionRoutes from "./routes/subscription.js";


dotenv.config();


const app = express();

const PORT = process.env.PORT || 5000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(
  __dirname,
  "uploads"
);


/*
  CORS
*/

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://your-deployed-frontend-url.vercel.app",
    ],
    credentials: true,
  })
);


/*
  BODY PARSER
*/

app.use(
  bodyParser.json({
    limit: "30mb",
  })
);


app.use(
  bodyParser.urlencoded({
    limit: "30mb",
    extended: true,
  })
);


/*
  UPLOADS
*/

app.use(
  "/uploads",
  express.static(uploadsPath)
);


/*
  API ROUTES
*/

app.use(
  "/user",
  userroutes
);


app.use(
  "/video",
  videoroutes
);


app.use(
  "/history",
  historyRoutes
);


app.use(
  "/like",
  likeRoutes
);


app.use(
  "/dislike",
  dislikeRoutes
);


app.use(
  "/watchlater",
  watchlaterRoutes
);


app.use(
  "/channel",
  channelRoutes
);


app.use(
  "/comment",
  commentRoutes
);


app.use(
  "/subscription",
  subscriptionRoutes
);


/*
  TEST ROUTE
*/

app.get("/", (req, res) => {
  res.send(
    "YouTube backend is working fine locally"
  );
});


/*
  MONGODB
*/

const DBURL = process.env.DB_URL || "mongodb://127.0.0.1:27017/youtube";


console.log(
  "Connecting to Database..."
);


mongoose
  .connect(DBURL)
  .then(() => {

    console.log(
      "🍃 Mongodb connected successfully!"
    );


    app.listen(PORT, () => {

      console.log(
        `🚀 Server running on port ${PORT}`
      );

      console.log(
        `📁 Uploads served from: ${uploadsPath}`
      );

    });

  })
  .catch((error) => {

    console.error(
      "❌ Connection failed:",
      error
    );

  });