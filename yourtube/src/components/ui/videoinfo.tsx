import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./avatar";
import { Button } from "./button";
import { ThumbsUp, ThumbsDown, Share, Download, MoreHorizontal, Clock } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

interface VideoProps {
  id: string;
  videotitle: string;
  videochannel: string;
  Like?: number;
  Dislike?: number;
}

const VideoInfo: React.FC<{ video: VideoProps }> = ({ video }) => {
  const [likes, setLikes] = useState(video?.Like || 0);
  const [dislikes, setDislikes] = useState(video?.Dislike || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);

  const user = { id: "1", name: "Sharon" };

  useEffect(() => {
    setLikes(video?.Like || 0);
    setDislikes(video?.Dislike || 0);
    setIsLiked(false);
    setIsDisliked(false);
    setIsWatchLater(false);
  }, [video]);

const handleLike = async () => {
  try {
    const res = await axiosInstance.post(`/like/${video.id}`, {
      userId: user.id,
    });

    const { liked } = res.data;

    setLikes((prev) => (liked ? prev + 1 : prev - 1));
    setIsLiked(liked);

    // if switching from dislike → like
    if (liked && isDisliked) {
      setDislikes((prev) => prev - 1);
      setIsDisliked(false);
    }
  } catch (error) {
    console.error("Error liking video:", error);
  }
};

const handleDislike = async () => {
  try {
    const res = await axiosInstance.post(`/dislike/${video.id}`, {
      userId: user.id,
    });

    const { disliked } = res.data;

    setDislikes((prev) => (disliked ? prev + 1 : prev - 1));
    setIsDisliked(disliked);

    if (disliked && isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    }
  } catch (error) {
    console.error("Error disliking video:", error);
  }
};
  const handleWatchLater = async () => {
    try {
      const res = await axiosInstance.post(`/watchlater/${video.id}`, { userId: user.id });
      setIsWatchLater(res.data.watchlater);
    } catch (error) {
      console.error("Error adding to watch later:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{video.videotitle}</h1>

      <div className="flex items-center justify-between">
        {/* Channel Info */}
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback>
              {video?.videochannel?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{video.videochannel}</h3>
            <p className="text-sm text-gray-600">1.2M subscribers</p>
          </div>
          <Button className="ml-4 bg-red-600 text-white hover:bg-red-700">
            Subscribe
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button
              onClick={handleLike}
              className={`flex gap-2 ${isLiked ? "bg-gray-200" : ""}`}
            >
              <ThumbsUp className="w-4 h-4" />
              {likes.toLocaleString()}
            </Button>
            <div className="w-[1px] h-6 bg-gray-300 mx-1" />
            <Button
              onClick={handleDislike}
              className={`flex gap-2 ${isDisliked ? "bg-gray-200" : ""}`}
            >
              <ThumbsDown className="w-4 h-4" />
              {dislikes.toLocaleString()}
            </Button>
          </div>
          <Button
            onClick={handleWatchLater}
            className={`flex gap-2 ${isWatchLater ? "bg-gray-200" : ""}`}
          >
            <Clock className="w-4 h-4" /> {isWatchLater ? "Saved" : "Watch Later"}
          </Button>
          <Button className="flex gap-2">
            <Share className="w-4 h-4" /> Share
          </Button>
          <Button className="flex gap-2">
            <Download className="w-4 h-4" /> Download
          </Button>
          <Button>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
