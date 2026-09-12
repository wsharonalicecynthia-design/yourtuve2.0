"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MoreVertical,
  X,
  Heart,
  Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserContext } from "@/lib/AuthContext";

interface Video {
  _id: string;
  videotitle?: string;
  videochannel?: string;
  views?: number;
  createdAt?: string;
  filepath?: string;
  thumbnail?: string;
}

interface LikedItem {
  _id: string;
  videoid: string;
  viewer: string;
  likedOn?: string;
  video?: Video;
}

export default function LikedContent() {
  const { user }: any = useContext(UserContext);

  const [likedVideos, setLikedVideos] = useState<LikedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backendUrl = (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");

  const getVideoUrl = (filepath?: string) => {
    if (!filepath) return "";

    if (
      filepath.startsWith("http://") ||
      filepath.startsWith("https://")
    ) {
      return filepath;
    }

    return `${backendUrl}/${filepath.replace(/^\/+/, "")}`;
  };

  const getTimeAgo = (date?: string) => {
    if (!date) return "Recently uploaded";

    const createdAt = new Date(date);

    if (isNaN(createdAt.getTime())) {
      return "Recently uploaded";
    }

    return `${formatDistanceToNow(createdAt)} ago`;
  };

  useEffect(() => {
    let cancelled = false;

    const fetchLikedVideos = async () => {
      if (!user?._id) {
        setLikedVideos([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log(
          "Fetching liked videos:",
          `${backendUrl}/like/${user._id}`
        );

        const controller = new AbortController();

        const timeout = setTimeout(() => {
          controller.abort();
        }, 8000);

        const response = await fetch(
          `${backendUrl}/like/${user._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}`
          );
        }

        const data = await response.json();

        if (!cancelled) {
          setLikedVideos(
            Array.isArray(data) ? data : []
          );
        }
      } catch (err: any) {
        console.error("LIKED VIDEOS ERROR:", err);

        if (!cancelled) {
          if (err?.name === "AbortError") {
            setError(
              "The server is taking too long to respond."
            );
          } else {
            setError(
              err?.message ||
                "Unable to load liked videos."
            );
          }

          setLikedVideos([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchLikedVideos();

    return () => {
      cancelled = true;
    };
  }, [user?._id, backendUrl]);

  const handleRemoveLike = async (likedId: string) => {
    try {
      const response = await fetch(
        `${backendUrl}/like/${likedId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Remove like failed: ${response.status}`
        );
      }

      setLikedVideos((prev) =>
        prev.filter(
          (item) => item._id !== likedId
        )
      );
    } catch (error) {
      console.error(
        "REMOVE LIKE ERROR:",
        error
      );
    }
  };

  /* LOADING */

  if (loading) {
    return (
      <div className="flex min-h-[650px] flex-col items-center justify-center text-center">
        <div
          className="
            h-14
            w-14
            rounded-full
            border-4
            border-gray-200
            border-t-red-600
            animate-spin
          "
        />

        <p className="mt-5 text-sm text-gray-500">
          Loading your liked videos...
        </p>
      </div>
    );
  }

  /* ERROR */

  if (error) {
    return (
      <div className="flex min-h-[650px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <Heart
            className="h-11 w-11 text-red-500"
            fill="currentColor"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-950">
          Couldn't load liked videos
        </h2>

        <p className="mt-3 max-w-md text-sm text-gray-500">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="
            mt-7
            rounded-full
            bg-black
            px-6
            py-3
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            hover:bg-gray-800
            hover:-translate-y-0.5
            active:scale-95
          "
        >
          Try again
        </button>
      </div>
    );
  }

  /* EMPTY */

  if (likedVideos.length === 0) {
    return (
      <div className="flex min-h-[650px] flex-col items-center justify-center px-6 text-center">

        <div className="relative mb-8">
          <div
            className="
              flex
              h-28
              w-28
              items-center
              justify-center
              rounded-full
              bg-red-50
              shadow-[0_12px_35px_rgba(239,68,68,0.12)]
              animate-pulse
            "
          >
            <Heart
              className="h-12 w-12 text-red-500 transition-transform duration-500 hover:scale-110"
              fill="currentColor"
            />
          </div>

          <span className="absolute -right-3 top-2 h-2 w-2 rounded-full bg-red-300 animate-ping" />

          <span className="absolute -left-4 bottom-4 h-2 w-2 rounded-full bg-red-200 animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl">
          No liked videos yet
        </h2>

        <p className="mt-3 text-sm text-gray-500 sm:text-base">
          Videos you like will appear here.
        </p>

        <Link
          href="/"
          className="
            mt-7
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-black
            px-6
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-gray-800
            hover:shadow-md
            active:scale-95
          "
        >
          <Play className="h-4 w-4 fill-white" />
          Explore videos
        </Link>
      </div>
    );
  }

  /* CONTENT */

  return (
    <div className="space-y-6 px-6 py-7">

      <div className="animate-fade-in">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
          Your activity
        </p>

        <div className="mt-1 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-950">
              Liked videos
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Videos you've enjoyed.
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600">
            {likedVideos.length}{" "}
            {likedVideos.length === 1
              ? "video"
              : "videos"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {likedVideos.map((item, index) => {
          if (!item.video) {
            return null;
          }

          const video = item.video;
          const videoUrl = getVideoUrl(
            video.filepath
          );

          return (
            <div
              key={item._id}
              className="
                group
                flex
                gap-4
                rounded-2xl
                border
                border-transparent
                p-3
                transition-all
                duration-300
                hover:border-gray-200
                hover:bg-gray-50
                animate-slide-up
              "
              style={{
                animationDelay: `${index * 60}ms`,
                animationFillMode: "both",
              }}
            >
              <Link
                href={`/watch/${video._id}`}
                className="flex-shrink-0"
              >
                <div
                  className="
                    relative
                    aspect-video
                    w-48
                    overflow-hidden
                    rounded-xl
                    bg-gray-100
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:shadow-md
                  "
                >
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      muted
                      playsInline
                      preload="metadata"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Play className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-black/0
                      transition-all
                      duration-300
                      group-hover:bg-black/20
                    "
                  >
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        scale-75
                        items-center
                        justify-center
                        rounded-full
                        bg-black/80
                        text-white
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:scale-100
                        group-hover:opacity-100
                      "
                    >
                      <Play
                        className="ml-0.5 h-5 w-5"
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  <div
                    className="
                      absolute
                      bottom-2
                      left-2
                      flex
                      items-center
                      gap-1
                      rounded-full
                      bg-black/75
                      px-2
                      py-1
                      text-[10px]
                      font-medium
                      text-white
                    "
                  >
                    <Heart
                      className="h-3 w-3 text-red-400"
                      fill="currentColor"
                    />
                    Liked
                  </div>
                </div>
              </Link>

              <div className="flex min-w-0 flex-1 justify-between">
                <div className="flex min-w-0 flex-col justify-center">

                  <Link href={`/watch/${video._id}`}>
                    <h3
                      className="
                        line-clamp-2
                        text-base
                        font-semibold
                        leading-snug
                        text-gray-900
                        transition-colors
                        group-hover:text-red-600
                      "
                    >
                      {video.videotitle ||
                        "Untitled video"}
                    </h3>
                  </Link>

                  <p className="mt-2 text-sm text-gray-500">
                    {video.videochannel ||
                      "Unknown channel"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {(video.views || 0).toLocaleString()}{" "}
                    views
                    {" • "}
                    {getTimeAgo(video.createdAt)}
                  </p>

                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="
                        h-9
                        w-9
                        rounded-full
                        opacity-0
                        transition-all
                        duration-200
                        group-hover:opacity-100
                        hover:bg-gray-200
                      "
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-700"
                      onClick={() =>
                        handleRemoveLike(item._id)
                      }
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove from liked videos
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}