import Link from "next/link";
import React from "react";
import { formatDistanceToNow } from "date-fns";

const VideoCard = ({ video }: any) => {
  if (!video) return null;

  return (
    <Link
      href={`/watch/${video._id}`}
      className="group block no-underline text-inherit"
    >
      <div className="space-y-3 w-full max-w-[360px] cursor-pointer">
        {/* Video */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900">
          {video.filepath ? (
            <video
              src={video.filepath}
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              No Video
            </div>
          )}

          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
            {video.duration || "10:24"}
          </div>
        </div>

        {/* Details */}
        <div className="flex gap-3 px-1">
          {/* Avatar */}
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-zinc-200 text-zinc-800 font-semibold text-sm shrink-0">
            {video.videochannel
              ? video.videochannel.charAt(0).toUpperCase()
              : "Y"}
          </div>

          {/* Text */}
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-semibold text-zinc-900 leading-tight line-clamp-2">
              {video.videotitle}
            </h3>

            <p className="text-xs text-zinc-600 mt-1">
              {video.videochannel}
            </p>

            <p className="text-xs text-zinc-500 mt-0.5">
              {(video.views || 0).toLocaleString()} views •{" "}
              {video.createdAt
                ? formatDistanceToNow(new Date(video.createdAt), {
                    addSuffix: true,
                  })
                : "Recently"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;