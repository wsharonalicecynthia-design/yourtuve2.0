"use client";

import { useState, useEffect, Suspense, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, Clock, Play } from "lucide-react";

import axiosInstance from "@/lib/axiosInstance";
import { UserContext } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WatchLaterItem {
  _id: string;
  videoId: {
    _id: string;
    videotitle: string;
    videochannel: string;
    views: number;
    thumbnail?: string;
    createdAt: string;
  };
}

function WatchLaterContentComponent() {
  const { user } = useContext(UserContext) || {};

  const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchLater = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get(`/watchlater/${user._id}`);
        setWatchLater(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching watch later:", err);
        setWatchLater([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchLater();
  }, [user]);

  const handleRemove = async (id: string) => {
    try {
      await axiosInstance.delete(`/watchlater/${id}`);
      setWatchLater((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error removing video:", err);
    }
  };

  if (loading)
    return <div className="p-4">Loading watch later...</div>;

  if (!user)
    return (
      <div className="text-center py-12">
        Please sign in to view your Watch Later list.
      </div>
    );

  if (watchLater.length === 0)
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold">
          Your Watch Later list is empty
        </h2>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p>{watchLater.length} videos</p>

        <Button>
          <Play className="w-4 h-4 mr-2" />
          Play all
        </Button>
      </div>

      {watchLater.map((item) => (
        <div key={item._id} className="flex gap-4 group">
          <Link href={`/watch/${item.videoId._id}`}>
            <div className="relative w-40 aspect-video rounded overflow-hidden bg-gray-100">
              <Image
                src={item.videoId.thumbnail || "/placeholder.svg"}
                alt={item.videoId.videotitle}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          <div className="flex-1 flex justify-between">
            <div>
              <Link href={`/watch/${item.videoId._id}`}>
                <h3 className="font-medium">
                  {item.videoId.videotitle}
                </h3>
              </Link>

              <p className="text-sm text-gray-600">
                {item.videoId.videochannel}
              </p>

              <p className="text-sm text-gray-500">
                {item.videoId.views.toLocaleString()} views •{" "}
                {formatDistanceToNow(
                  new Date(item.videoId.createdAt)
                )}{" "}
                ago
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
                  onClick={() => handleRemove(item._id)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WatchLaterPage() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Watch Later</h1>

        <Suspense fallback={<div>Loading...</div>}>
          <WatchLaterContentComponent />
        </Suspense>
      </div>
    </main>
  );
}