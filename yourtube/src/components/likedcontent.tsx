"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserContext } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

interface LikedItem {
  _id: string;
  videoid: string;
  viewer: string;
  watchedon: string;
  video: {
    _id: string;
    videotitle: string;
    videochannel: string;
    views: number;
    createdAt: string;
    filepath?: string;
    thumbnail?: string;
  };
}

export default function LikedContent() {
  const { user }: any = useContext(UserContext);

  const [likedVideos, setLikedVideos] = useState<LikedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchLikedVideos();
  }, [user]);

  const fetchLikedVideos = async () => {
    try {
      const res = await axiosInstance.get(`/liked/${user._id}`);
      setLikedVideos(res.data || []);
    } catch (error) {
      console.error("Error fetching liked videos:", error);
      setLikedVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLike = async (likedId: string) => {
    try {
      await axiosInstance.delete(`/liked/${likedId}`);

      setLikedVideos((prev) =>
        prev.filter((item) => item._id !== likedId)
      );
    } catch (error) {
      console.error("Error removing liked video:", error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading liked videos...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold">
          Please login to view your liked videos.
        </h2>
      </div>
    );
  }

  if (likedVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          No liked videos yet
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        {likedVideos.length} videos
      </p>

      {likedVideos.map((item) => (
        <div key={item._id} className="flex gap-4 group">
          <Link href={`/watch/${item.video._id}`}>
            <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
              {item.video.filepath ? (
                <video
                  src={item.video.filepath}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
          </Link>

          <div className="flex-1">
            <Link href={`/watch/${item.video._id}`}>
              <h3 className="font-medium text-sm line-clamp-2">
                {item.video.videotitle}
              </h3>
            </Link>

            <p className="text-xs text-gray-600">
              {item.video.videochannel}
            </p>

            <p className="text-xs text-gray-500">
              {(item.video.views || 0).toLocaleString()} views •{" "}
              {formatDistanceToNow(new Date(item.video.createdAt))} ago
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleRemoveLike(item._id)}
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}