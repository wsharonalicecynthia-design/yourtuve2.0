"use client";

import { useContext, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
interface WatchLaterItem {
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
    thumbnail?: string;
  };
}

function WatchLaterContentComponent() {
  const { user }: any = useContext(UserContext);

  const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);
  const [loading, setLoading] = useState(true);
  if (watchLater.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Your Watch Later list is empty
        </h2>
      </div>
    );
  }
  useEffect(() => {
  if (!user) {
    setLoading(false);
    return;
  }

  const fetchWatchLater = async () => {
    try {
      const res = await axiosInstance.get(`/watchlater/${user._id}`);

      setWatchLater(res.data || []);
    } catch (error) {
      console.error("Error fetching watch later:", error);
      setWatchLater([]);
    } finally {
      setLoading(false);
    }
  };

  fetchWatchLater();
}, [user]);
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">
          Please login to view your Watch Later list.
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {watchLater.length} videos
        </p>

        <Button className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          Play all
        </Button>
      </div>

      <div className="space-y-4">
        {watchLater.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 group relative"
          >
            <Link
              href={`/watch/${item.video._id}`}
              className="flex-shrink-0"
            >
              <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
                <Image
                  src={item.video.thumbnail || "/placeholder.svg"}
                  alt={item.video.videotitle}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>

            <div className="flex-1 min-w-0 flex justify-between items-start">
              <div className="space-y-1">
                <Link href={`/watch/${item.video._id}`}>
                  <h3 className="font-medium text-sm line-clamp-2">
                    {item.video.videotitle}
                  </h3>
                </Link>

                <p className="text-xs text-gray-600">
                  {item.video.videochannel}
                </p>

                <p className="text-xs text-gray-500">
                  {item.video.views.toLocaleString()} views •{" "}
                  {formatDistanceToNow(
                    new Date(item.video.createdAt)
                  )}{" "}
                  ago
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WatchLaterPage() {
  return (
    <main className="flex-1 p-6 w-full min-h-screen bg-white">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">
          Watch Later
        </h1>

        <Suspense fallback={<div>Loading watch later...</div>}>
          <WatchLaterContentComponent />
        </Suspense>
      </div>
    </main>
  );
}