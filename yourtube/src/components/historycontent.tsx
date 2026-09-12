"use client";

import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import axiosInstance from "@/lib/axiosInstance";
import { UserContext } from "@/lib/AuthContext";

import { Clock, Play, Trash2 } from "lucide-react";

interface Video {
  _id: string;
  videotitle?: string;
  videochannel?: string;
  filepath?: string;
  filename?: string;
  views?: number;
  createdAt?: string;
}

interface HistoryItem {
  _id: string;
  watchedon?: string;
  videoid?: string;
  video?: Video;
}

const HistoryContent = () => {
  const context = useContext(UserContext);
  const user = context?.user;

  const [history, setHistory] =
    useState<HistoryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    fetchHistory();
  }, [user?._id]);


  const fetchHistory = async () => {
    if (!user?._id) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await axiosInstance.get(
          `/history/${user._id}`
        );

      console.log(
        "HISTORY RESPONSE:",
        response.data
      );

      setHistory(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err: any) {
      console.error(
        "HISTORY ERROR:",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load history"
      );
    } finally {
      setLoading(false);
    }
  };


  const removeHistory = async (
    historyId: string
  ) => {
    try {
      await axiosInstance.delete(
        `/history/${historyId}`
      );

      setHistory((previous) =>
        previous.filter(
          (item) =>
            item._id !== historyId
        )
      );
    } catch (err: any) {
      console.error(
        "REMOVE HISTORY ERROR:",
        err?.response?.data || err
      );
    }
  };


  const clearHistory = async () => {
    if (!user?._id) {
      return;
    }

    try {
      await axiosInstance.delete(
        `/history/user/${user._id}`
      );

      setHistory([]);
    } catch (err: any) {
      console.error(
        "CLEAR HISTORY ERROR:",
        err?.response?.data || err
      );
    }
  };


  /*
    NOT LOGGED IN
  */

  if (!user) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
        <Clock className="mb-4 h-16 w-16 text-gray-300" />

        <h2 className="text-2xl font-bold text-gray-900">
          Sign in to see your history
        </h2>

        <p className="mt-2 text-gray-500">
          Videos you watch will appear here.
        </p>
      </div>
    );
  }


  /*
    LOADING
  */

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading watch history...
      </div>
    );
  }


  /*
    ERROR
  */

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          {error}
        </p>

        <button
          onClick={fetchHistory}
          className="mt-3 rounded-full bg-black px-4 py-2 text-sm text-white"
        >
          Try again
        </button>
      </div>
    );
  }


  /*
    EMPTY
  */

  if (history.length === 0) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center text-center">

        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <Clock className="h-12 w-12 text-red-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          No watch history yet
        </h2>

        <p className="mt-2 text-gray-500">
          Videos you watch will appear here.
        </p>

        <Link
          href="/"
          className="mt-8 flex items-center gap-2 rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          <Play className="h-5 w-5 fill-white" />
          Start watching
        </Link>

      </div>
    );
  }


  /*
    HISTORY
  */

  return (
    <div>

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Watch history
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {history.length}{" "}
            {history.length === 1
              ? "video"
              : "videos"}
          </p>
        </div>

        <button
          onClick={clearHistory}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
        >
          <Trash2 className="h-4 w-4" />
          Clear history
        </button>

      </div>


      <div className="flex flex-col gap-4">

        {history.map((item) => {

          const video =
            item.video;

          if (!video) {
            return null;
          }

          return (
            <div
              key={item._id}
              className="group flex gap-4 rounded-xl p-2 transition hover:bg-gray-50"
            >

              <Link
                href={`/watch/${video._id}`}
                className="relative h-36 w-60 flex-shrink-0 overflow-hidden rounded-xl bg-black"
              >

                {video.filepath ? (
                  <video
                    src={`${
                      process.env
                        .NEXT_PUBLIC_BACKEND_URL ||
                      "http://localhost:5000"
                    }${video.filepath}`}
                    muted
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-white">
                    No preview
                  </div>
                )}

              </Link>


              <div className="min-w-0 flex-1">

                <Link
                  href={`/watch/${video._id}`}
                >
                  <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 hover:text-blue-600">
                    {video.videotitle ||
                      "Untitled video"}
                  </h3>
                </Link>

                <p className="mt-2 text-sm text-gray-600">
                  {video.videochannel ||
                    "YourTube"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {(video.views || 0).toLocaleString()}{" "}
                  views
                </p>

                {item.watchedon && (
                  <p className="mt-1 text-sm text-gray-400">
                    Watched{" "}
                    {new Date(
                      item.watchedon
                    ).toLocaleString()}
                  </p>
                )}

              </div>


              <button
                onClick={() =>
                  removeHistory(
                    item._id
                  )
                }
                className="self-start rounded-full p-2 text-gray-400 opacity-0 transition hover:bg-gray-100 hover:text-red-500 group-hover:opacity-100"
                title="Remove from history"
              >
                <Trash2 className="h-5 w-5" />
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default HistoryContent;