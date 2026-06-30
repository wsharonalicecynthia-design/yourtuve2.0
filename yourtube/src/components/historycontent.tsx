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

interface HistoryItem {
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
  };
}

const HistoryContentComponent = () => {
  const { user }: any = useContext(UserContext);

  const [watchHistoryData, setWatchHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    try {
      const res = await axiosInstance.get(`/history/${user._id}`);
      setWatchHistoryData(res.data || []);
    } catch (error) {
      console.error("Error loading history:", error);
      setWatchHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromHistory = async (historyId: string) => {
    try {
      await axiosInstance.delete(`/history/${historyId}`);

      setWatchHistoryData((prev) =>
        prev.filter((item) => item._id !== historyId)
      );
    } catch (error) {
      console.error("Error removing history:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-2 text-sm text-gray-500 font-medium">
        Loading history...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Please login to view your history
        </h2>
      </div>
    );
  }

  if (watchHistoryData.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          No watch history yet
        </h2>
        <p className="text-gray-600">
          Videos you watch will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
        <p className="text-xs font-medium text-gray-500">
          {watchHistoryData.length} videos
        </p>
      </div>

      <div className="space-y-4">
        {watchHistoryData.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 p-2 rounded-2xl hover:bg-gray-50/50 transition-colors group relative"
          >
            {/* Thumbnail */}
            <Link
              href={`/watch/${item.video._id}`}
              className="flex-shrink-0"
            >
              <div className="relative w-40 aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                <video
                  src="/video/music.mp4"
                  muted
                  playsInline
                  className="object-cover w-full h-full"
                />
              </div>
            </Link>

            {/* Metadata */}
            <div className="flex-1 min-w-0 flex justify-between items-start">
              <div className="flex flex-col justify-center">
                <Link href={`/watch/${item.video._id}`}>
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 hover:text-blue-600 leading-snug mb-1">
                    {item.video.videotitle}
                  </h3>
                </Link>

                <p className="text-xs text-gray-500">
                  {item.video.videochannel}
                </p>

                <p className="text-[11px] text-gray-400 mt-1">
                  {item.video.views.toLocaleString()} views •{" "}
                  {formatDistanceToNow(
                    new Date(item.video.createdAt)
                  )}{" "}
                  ago
                </p>

                <p className="text-[11px] text-blue-500 font-medium mt-0.5">
                  Watched{" "}
                  {formatDistanceToNow(new Date(item.watchedon))} ago
                </p>
              </div>

              {/* Action Menu */}
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-700 cursor-pointer"
                      onClick={() =>
                        handleRemoveFromHistory(item._id)
                      }
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove from history
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryContentComponent;