"use client";

import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Clock,
} from "lucide-react";

import { UserContext } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";

interface Video {
  _id: string;
  videotitle?: string;
  videochannel?: string;
  uploader?: string;
  views?: number;
  like?: number;
  dislike?: number;
}

interface VideoInfoProps {
  video: Video | null;
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  video,
}) => {
  const context = useContext(UserContext);
  const user = context?.user;

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    video?.like || 0
  );
  const [dislikeCount, setDislikeCount] = useState(
    video?.dislike || 0
  );
  const [watchLater, setWatchLater] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikeCount(video?.like || 0);
    setDislikeCount(video?.dislike || 0);
  }, [video]);

  if (!video) {
    return null;
  }

  const requireLogin = () => {
    if (!user) {
      toast.error("Please sign in first");
      return false;
    }

    return true;
  };

  const handleLike = async () => {
    if (!requireLogin()) {
      return;
    }

    if (!video._id || !user?._id) {
      return;
    }

    try {
      setLoading(true);

      if (liked) {
        setLiked(false);
        setLikeCount((count) =>
          Math.max(0, count - 1)
        );
        return;
      }

      await axiosInstance.post("/like", {
        viewer: user._id,
        videoid: video._id,
      });

      setLiked(true);
      setDisliked(false);
      setLikeCount((count) => count + 1);

      toast.success("Added to liked videos");
    } catch (error: any) {
      console.error(
        "LIKE ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to like video"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!requireLogin()) {
      return;
    }

    if (!video._id || !user?._id) {
      return;
    }

    try {
      setDisliked(!disliked);

      if (!disliked) {
        setDislikeCount((count) => count + 1);

        if (liked) {
          setLiked(false);
          setLikeCount((count) =>
            Math.max(0, count - 1)
          );
        }
      } else {
        setDislikeCount((count) =>
          Math.max(0, count - 1)
        );
      }
    } catch (error) {
      console.error("DISLIKE ERROR:", error);
    }
  };

  const handleWatchLater = async () => {
    if (!requireLogin()) {
      return;
    }

    if (!video._id || !user?._id) {
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/watchlater", {
        viewer: user._id,
        videoid: video._id,
      });

      setWatchLater(true);

      toast.success("Added to Watch later");
    } catch (error: any) {
      console.error(
        "WATCH LATER ERROR:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to add to Watch later"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title:
            video.videotitle || "Check out this video",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Video link copied");
      }
    } catch (error) {
      console.error("SHARE ERROR:", error);
    }
  };

  return (
    <div className="w-full">

      {/* TITLE */}
      <h1 className="text-xl font-bold leading-7 text-gray-900">
        {video.videotitle || "Untitled video"}
      </h1>

      {/* CHANNEL + VIEWS */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <span className="font-medium text-gray-900">
          {video.videochannel || "YourTube"}
        </span>

        <span>•</span>

        <span>
          {(video.views || 0).toLocaleString()} views
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-5 flex flex-wrap items-center gap-3">

        {/* LIKE */}
        <button
          type="button"
          onClick={handleLike}
          disabled={loading}
          className={`
            flex
            items-center
            gap-2
            rounded-full
            px-4
            py-2.5
            text-sm
            font-medium
            transition-all
            duration-200
            ${
              liked
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }
          `}
        >
          <ThumbsUp className="h-4 w-4" />

          <span>{likeCount}</span>
        </button>

        {/* DISLIKE */}
        <button
          type="button"
          onClick={handleDislike}
          disabled={loading}
          className={`
            flex
            items-center
            gap-2
            rounded-full
            px-4
            py-2.5
            text-sm
            font-medium
            transition-all
            duration-200
            ${
              disliked
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }
          `}
        >
          <ThumbsDown className="h-4 w-4" />

          <span>{dislikeCount}</span>
        </button>

        {/* SHARE */}
        <button
          type="button"
          onClick={handleShare}
          className="
            flex
            items-center
            gap-2
            rounded-full
            bg-gray-100
            px-4
            py-2.5
            text-sm
            font-medium
            text-gray-800
            transition-all
            duration-200
            hover:bg-gray-200
          "
        >
          <Share2 className="h-4 w-4" />

          <span>Share</span>
        </button>

        {/* WATCH LATER */}
        <button
          type="button"
          onClick={handleWatchLater}
          disabled={loading}
          className={`
            flex
            items-center
            gap-2
            rounded-full
            px-4
            py-2.5
            text-sm
            font-medium
            transition-all
            duration-200
            ${
              watchLater
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }
          `}
        >
          <Clock className="h-4 w-4" />

          <span>
            {watchLater
              ? "Saved"
              : "Watch later"}
          </span>
        </button>

      </div>
    </div>
  );
};

export default VideoInfo;