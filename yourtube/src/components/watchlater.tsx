"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  Play,
  MoreVertical,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserContext } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

interface WatchLaterItem {
  _id: string;
  videoid: string;
  viewer: string;
  watchedon?: string;

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

export default function WatchLaterContent() {
  const { user }: any = useContext(UserContext);

  const [watchLater, setWatchLater] = useState<
    WatchLaterItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backendUrl = (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    if (!user?._id) {
      setWatchLater([]);
      setLoading(false);
      return;
    }

    const fetchWatchLater = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(
          `/watchlater/${user._id}`
        );

        setWatchLater(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error: any) {
        console.error(
          "WATCH LATER ERROR:",
          error?.response?.data || error
        );

        setError(
          error?.response?.data?.message ||
            "Unable to load Watch Later."
        );

        setWatchLater([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchLater();
  }, [user?._id]);

  /* ---------------- REMOVE ---------------- */

  const handleRemove = async (id: string) => {
    try {
      await axiosInstance.delete(
        `/watchlater/${id}`
      );

      setWatchLater((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(
        "REMOVE WATCH LATER ERROR:",
        error
      );
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex min-h-[650px] items-center justify-center">
        <div className="flex flex-col items-center text-center">

          <div
            className="
              h-12
              w-12
              rounded-full
              border-4
              border-gray-200
              border-t-red-600
              animate-spin
            "
          />

          <p className="mt-5 text-sm text-gray-500">
            Loading your Watch Later videos...
          </p>

        </div>
      </div>
    );
  }

  /* ---------------- LOGIN ---------------- */

  if (!user) {
    return (
      <div className="flex min-h-[650px] flex-col items-center justify-center text-center">

        <div
          className="
            mb-7
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
          <Clock className="h-12 w-12 text-red-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-950">
          Sign in to use Watch Later
        </h2>

        <p className="mt-3 text-sm text-gray-500">
          Save videos and come back to watch them later.
        </p>

      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <div className="flex min-h-[650px] flex-col items-center justify-center text-center">

        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <Clock className="h-11 w-11 text-red-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-950">
          Couldn't load Watch Later
        </h2>

        <p className="mt-3 text-sm text-gray-500">
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
            hover:-translate-y-0.5
            hover:bg-gray-800
            active:scale-95
          "
        >
          Try again
        </button>

      </div>
    );
  }

  /* ---------------- EMPTY ---------------- */

  if (watchLater.length === 0) {
    return (
      <div className="flex min-h-[650px] flex-col items-center justify-center text-center">

        {/* Animated icon */}

        <div className="relative mb-8">

          <div
            className="
              flex
              h-28
              w-28
              items-center
              justify-center
              rounded-full
              bg-gray-100
              shadow-[0_12px_35px_rgba(0,0,0,0.06)]
              animate-pulse
            "
          >
            <Clock
              className="
                h-12
                w-12
                text-gray-500
                transition-transform
                duration-500
                hover:scale-110
              "
            />
          </div>

          {/* Moving dots */}

          <span
            className="
              absolute
              -right-3
              top-2
              h-2
              w-2
              rounded-full
              bg-red-400
              animate-ping
            "
          />

          <span
            className="
              absolute
              -left-4
              bottom-4
              h-2
              w-2
              rounded-full
              bg-gray-400
              animate-pulse
            "
          />

        </div>

        <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl">
          No videos saved yet
        </h2>

        <p className="mt-3 text-sm text-gray-500 sm:text-base">
          Save videos to Watch Later and come back anytime.
        </p>

        <Link href="/">
          <Button
            className="
              mt-7
              rounded-full
              bg-black
              px-6
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-gray-800
              active:scale-95
            "
          >
            <Play
              className="mr-2 h-4 w-4"
              fill="currentColor"
            />
            Start watching
          </Button>
        </Link>

      </div>
    );
  }

  /* ---------------- CONTENT ---------------- */

  return (
    <div className="px-6 py-7">

      {/* HEADER */}

      <div className="mb-7 flex items-end justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
            Your activity
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-950">
            Watch Later
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {watchLater.length}{" "}
            {watchLater.length === 1
              ? "video"
              : "videos"}{" "}
            saved for later.
          </p>

        </div>

        <Button
          className="
            hidden
            items-center
            gap-2
            rounded-full
            bg-black
            sm:flex
            hover:bg-gray-800
          "
        >
          <Play
            className="h-4 w-4"
            fill="currentColor"
          />
          Play all
        </Button>

      </div>

      {/* VIDEO LIST */}

      <div className="space-y-3">

        {watchLater.map((item, index) => {

          if (!item.video) {
            return null;
          }

          const video = item.video;

          const videoUrl = video.filepath
            ? video.filepath.startsWith("http")
              ? video.filepath
              : `${backendUrl}/${video.filepath.replace(
                  /^\/+/,
                  ""
                )}`
            : "";

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
                animationDelay: `${index * 70}ms`,
                animationFillMode: "both",
              }}
            >

              {/* VIDEO */}

              <Link
                href={`/watch/${video._id}`}
                className="flex-shrink-0"
              >
                <div
                  className="
                    relative
                    aspect-video
                    w-52
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
                      <Play
                        className="h-8 w-8 text-gray-400"
                      />
                    </div>
                  )}

                  {/* Hover overlay */}

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
                        bg-white
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:scale-100
                        group-hover:opacity-100
                      "
                    >
                      <Play
                        className="ml-0.5 h-5 w-5"
                        fill="black"
                      />
                    </div>
                  </div>

                  {/* Saved badge */}

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
                    <Clock className="h-3 w-3" />
                    Saved
                  </div>

                </div>
              </Link>

              {/* DETAILS */}

              <div className="flex min-w-0 flex-1 justify-between">

                <div className="min-w-0 pt-1">

                  <Link
                    href={`/watch/${video._id}`}
                  >
                    <h3
                      className="
                        line-clamp-2
                        text-base
                        font-semibold
                        leading-6
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
                    {video.createdAt
                      ? formatDistanceToNow(
                          new Date(
                            video.createdAt
                          )
                        ) + " ago"
                      : "Recently uploaded"}
                  </p>

                  <div
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-gray-100
                      px-2.5
                      py-1
                      text-[11px]
                      text-gray-500
                    "
                  >
                    <Clock className="h-3 w-3" />
                    Saved for later
                  </div>

                </div>

                {/* MENU */}

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
                      className="
                        cursor-pointer
                        text-red-600
                        focus:text-red-700
                      "
                      onClick={() =>
                        handleRemove(item._id)
                      }
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove from Watch Later
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