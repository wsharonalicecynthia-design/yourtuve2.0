"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface RelatedVideo {
  _id: string;
  videotitle?: string;
  videochannel?: string;
  views?: number;
  createdAt?: string;
}

const RelatedVideos = ({
  videos,
}: {
  videos: RelatedVideo[];
}) => {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5000";

  if (!videos?.length) {
    return (
      <p className="text-sm text-gray-500">
        No recommended videos
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {videos.map((video) => (
        <Link
          key={video._id}
          href={`/watch/${video._id}`}
        >
          <div className="flex gap-3 rounded-lg p-2 transition hover:bg-gray-100">

            <video
              src={`${backendUrl}/video/stream/${video._id}`}
              className="h-24 w-40 flex-shrink-0 rounded-lg bg-black object-cover"
              muted
              preload="metadata"
            />

            <div className="min-w-0 flex-1">

              <h3 className="line-clamp-2 text-sm font-semibold">
                {video.videotitle ||
                  "Untitled video"}
              </h3>

              <p className="mt-1 truncate text-xs text-gray-600">
                {video.videochannel ||
                  "YourTube"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {(video.views || 0).toLocaleString()}
                {" views • "}
                {video.createdAt
                  ? `${formatDistanceToNow(
                      new Date(
                        video.createdAt
                      )
                    )} ago`
                  : "Just now"}
              </p>

            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedVideos;