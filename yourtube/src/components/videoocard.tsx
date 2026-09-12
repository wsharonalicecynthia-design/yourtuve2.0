"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Play } from "lucide-react";

const VideoCard = ({ video }: any) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [videoLoaded, setVideoLoaded] = useState(false);

  if (!video) return null;

  const channelName =
    video.videochannel || "YourTube";

  const backendUrl = (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");

  /*
   * Always use the backend stream route.
   * Example:
   * http://localhost:5000/video/stream/VIDEO_ID
   */
  const videoUrl = video._id
    ? `${backendUrl}/video/stream/${video._id}`
    : "";

  /*
   * When the video data is loaded,
   * move slightly into the video so the
   * actual frame is visible.
   */
  const handleLoadedData = () => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    try {
      videoElement.currentTime = 0.1;
    } catch {
      // Ignore seeking errors
    }

    setVideoLoaded(true);
  };

  /*
   * Some browsers fire canplay instead of
   * loadeddata at the moment the frame is ready.
   */
  const handleCanPlay = () => {
    setVideoLoaded(true);
  };

  /*
   * Play video when hovering.
   */
  const handleMouseEnter = () => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    videoElement
      .play()
      .catch(() => {});
  };

  /*
   * Stop video when mouse leaves.
   */
  const handleMouseLeave = () => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    videoElement.pause();

    try {
      videoElement.currentTime = 0.1;
    } catch {
      // Ignore seeking errors
    }
  };

  return (
    <Link
      href={`/watch/${video._id}`}
      className="group block no-underline text-inherit"
    >
      <div
        className="
          w-full
          max-w-[360px]
          cursor-pointer
          transition-all
          duration-200
          group-hover:-translate-y-1
        "
      >
        {/* ==================================================
            VIDEO THUMBNAIL
        ================================================== */}

        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="
            relative
            aspect-video
            overflow-hidden
            rounded-xl
            bg-zinc-900
            shadow-sm
            transition-shadow
            duration-200
            group-hover:shadow-md
          "
        >
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              playsInline
              preload="auto"
              onLoadedData={handleLoadedData}
              onCanPlay={handleCanPlay}
              className={`
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-all
                duration-300
                group-hover:scale-105
                ${
                  videoLoaded
                    ? "opacity-100"
                    : "opacity-0"
                }
              `}
            />
          )}

          {/* ==================================================
              LOADING PLACEHOLDER
          ================================================== */}

          {!videoLoaded && (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-zinc-900
              "
            >
              <Play
                className="
                  h-10
                  w-10
                  text-white/40
                "
                fill="currentColor"
              />
            </div>
          )}

          {/* ==================================================
              DARK HOVER OVERLAY
          ================================================== */}

          <div
            className="
              absolute
              inset-0
              bg-black/0
              transition-colors
              duration-200
              group-hover:bg-black/20
            "
          />

          {/* ==================================================
              PLAY BUTTON
          ================================================== */}

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              opacity-0
              transition-all
              duration-200
              group-hover:opacity-100
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                scale-75
                items-center
                justify-center
                rounded-full
                bg-white/95
                shadow-lg
                transition-transform
                duration-200
                group-hover:scale-100
              "
            >
              <Play
                className="
                  ml-0.5
                  h-5
                  w-5
                  text-black
                "
                fill="black"
              />
            </div>
          </div>

          {/* ==================================================
              DURATION
          ================================================== */}

          {video.duration && (
            <div
              className="
                absolute
                bottom-2
                right-2
                rounded-md
                bg-black/85
                px-2
                py-1
                text-xs
                font-medium
                text-white
              "
            >
              {video.duration}
            </div>
          )}
        </div>

        {/* ==================================================
            VIDEO DETAILS
        ================================================== */}

        <div
          className="
            mt-3
            flex
            gap-3
            px-1
          "
        >
          {/* ==================================================
              CHANNEL AVATAR
          ================================================== */}

          <div
            className="
              flex
              h-9
              w-9
              flex-shrink-0
              items-center
              justify-center
              rounded-full
              bg-zinc-200
              text-sm
              font-semibold
              uppercase
              text-zinc-800
            "
          >
            {channelName.charAt(0)}
          </div>

          {/* ==================================================
              VIDEO INFORMATION
          ================================================== */}

          <div
            className="
              flex
              min-w-0
              flex-1
              flex-col
            "
          >
            {/* TITLE */}

            <h3
              className="
                line-clamp-2
                text-sm
                font-semibold
                leading-snug
                text-zinc-900
                group-hover:text-black
              "
            >
              {video.videotitle ||
                "Untitled video"}
            </h3>

            {/* CHANNEL */}

            <p
              className="
                mt-1
                truncate
                text-xs
                text-zinc-600
              "
            >
              {channelName}
            </p>

            {/* VIEWS + DATE */}

            <p
              className="
                mt-0.5
                text-xs
                text-zinc-500
              "
            >
              {(video.views || 0).toLocaleString()}
              {" views"}
              {" • "}

              {video.createdAt
                ? formatDistanceToNow(
                    new Date(video.createdAt),
                    {
                      addSuffix: true,
                    }
                  )
                : "Recently"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;