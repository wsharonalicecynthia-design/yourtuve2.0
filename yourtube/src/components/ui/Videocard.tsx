"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "./avatar";

const videos = "/video/vdo.mp4"; // Note: This will show the same video for all cards

export default function VideoCard({ video }: any) {
  // 1. Create a safe date object
  const createdAt = video?.createdAt ? new Date(video.createdAt) : null;
  
  // 2. Validate the date
  const isValidDate = createdAt instanceof Date && !isNaN(createdAt.getTime());

  return (
    <Link href={`/watch/${video?._id}`} className="group">
      <div className="space-y-3">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
         <video 
  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${video.filepath}`} 
  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
/>
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
            10:24
          </div>
        </div>

        <div className="flex gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarFallback>
              {/* Ensure property names match your backend data */}
              {video?.videochannel?.[0] || "V"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">
              {video?.videotitle}
            </h3>

            <p className="text-sm text-gray-600 mt-1">
              {video?.videochannel}
            </p>

            <p className="text-sm text-gray-600">
              {video?.views?.toLocaleString() || 0} views •{" "}
              {/* 3. Conditional rendering for the date */}
              {isValidDate 
                ? `${formatDistanceToNow(createdAt)} ago` 
                : "Recently uploaded"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}