import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React from "react";

const RelatedVideos = ({ videos }: { videos: any[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {videos.map((video) => (
        <Link key={video._id} href={`/watch/${video._id}`}>
          <div className="flex gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition">
            {/* Thumbnail */}
            <video
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/video/play/${video.filename}`}
              className="w-44 h-24 rounded-lg object-cover bg-black"
              muted
              preload="metadata"
            />

            {/* Details */}
            <div className="flex flex-col flex-1">
              <h3 className="font-semibold text-sm line-clamp-2">
                {video.videotitle}
              </h3>

              <p className="text-xs text-gray-600 mt-1">
                {video.videochannel}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {(video.views || 0).toLocaleString()} views •{" "}
                {video.createdAt
                  ? `${formatDistanceToNow(new Date(video.createdAt))} ago`
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