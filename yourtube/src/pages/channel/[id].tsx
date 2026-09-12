import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/lib/axiosInstance";
import { UserContext } from "@/lib/AuthContext";
import { toast } from "sonner";

interface Video {
  _id: string;
  videotitle: string;
  videochannel: string;
  views?: number;
  filepath?: string;
  filename?: string;
  createdAt?: string;
}

interface Channel {
  _id: string;
  channelname: string;
  description?: string;
  email?: string;
}

const ChannelPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const context = useContext(UserContext);
  const currentUser = context?.user;

  const [channel, setChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Videos");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  const isOwner =
    currentUser?._id &&
    typeof id === "string" &&
    String(currentUser._id) === String(id);

  useEffect(() => {
    if (!router.isReady || typeof id !== "string") {
      return;
    }

    const fetchChannel = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get(
          `/channel/${id}`
        );

        setChannel(response.data.channel);
        setVideos(response.data.videos || []);
      } catch (error: any) {
        console.error(
          "CHANNEL ERROR:",
          error?.response?.data || error?.message || error
        );

        setChannel(null);
        setVideos([]);

        toast.error(
          error?.response?.data?.message ||
            "Failed to load channel"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [router.isReady, id]);

  const getVideoUrl = (video: Video) => {
    if (!video.filepath) {
      return "";
    }

    const backendUrl = (
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:5000"
    ).replace(/\/$/, "");

    return `${backendUrl}${video.filepath}`;
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a video");
      return;
    }

    if (!currentUser?._id) {
      toast.error("Please sign in before uploading");
      return;
    }

    if (!channel?._id) {
      toast.error("Channel not found");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", selectedFile);

      formData.append(
        "videotitle",
        selectedFile.name.replace(/\.[^/.]+$/, "")
      );

      formData.append(
        "videochannel",
        channel.channelname
      );

      // IMPORTANT:
      // The logged-in user is the uploader.
      formData.append(
        "uploader",
        String(currentUser._id)
      );

      const response = await axiosInstance.post(
        "/video/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("UPLOAD RESPONSE:", response.data);

      toast.success("Video uploaded successfully!");

      setSelectedFile(null);

      const fileInput = document.getElementById(
        "video-upload"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      // Reload this channel's videos
      const channelResponse =
        await axiosInstance.get(`/channel/${id}`);

      setChannel(channelResponse.data.channel);
      setVideos(channelResponse.data.videos || []);
    } catch (error: any) {
      console.error(
        "UPLOAD ERROR:",
        error?.response?.data || error?.message || error
      );

      toast.error(
        error?.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-8 py-12">
          <div className="animate-pulse">
            <div className="flex items-center gap-6">
              <div className="h-32 w-32 rounded-full bg-gray-200" />

              <div className="flex-1">
                <div className="h-9 w-96 max-w-full rounded bg-gray-200" />
                <div className="mt-3 h-5 w-64 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!channel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
            ?
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Channel not found
          </h1>

          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Go to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-12 text-black">

      {/* CHANNEL HEADER */}
      <section className="mx-auto max-w-6xl px-8 pt-10">
        <div className="flex items-center gap-7">

          {/* AVATAR */}
          <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-5xl font-medium text-gray-600">
            {channel.channelname
              ?.charAt(0)
              .toUpperCase() || "C"}
          </div>

          {/* CHANNEL INFO */}
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-3xl font-bold tracking-tight sm:text-4xl">
              {channel.channelname}
            </h1>

            <p className="mt-2 text-base text-gray-500">
              @
              {channel.channelname
                ?.toLowerCase()
                .replace(/\s+/g, "")}
            </p>

            {channel.description && (
              <p className="mt-2 text-sm text-gray-500">
                {channel.description}
              </p>
            )}
          </div>

          {/* ONLY OTHER USERS SEE SUBSCRIBE */}
          {!isOwner && (
            <button
              type="button"
              className="flex-shrink-0 rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-red-700 active:scale-95"
            >
              Subscribe
            </button>
          )}

        </div>
      </section>

      {/* TABS */}
      <section className="mx-auto mt-8 max-w-6xl border-b border-gray-200 px-8">
        <div className="flex gap-8">
          {[
            "Home",
            "Videos",
            "Shorts",
            "Playlists",
            "Community",
            "About",
          ].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`
                relative pb-4 text-sm font-semibold
                ${
                  activeTab === tab
                    ? "text-black"
                    : "text-gray-500 hover:text-black"
                }
              `}
            >
              {tab}

              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-black" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* VIDEOS TAB */}
      {activeTab === "Videos" && (
        <section className="mx-auto max-w-6xl px-8 pt-8">

          {/* UPLOAD — ONLY ON YOUR OWN CHANNEL */}
          {isOwner && (
            <div className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">

              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
                  Creator Studio
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Upload a video
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Share a new video on your channel.
                </p>
              </div>

              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(event) => {
                  const file =
                    event.target.files?.[0] || null;

                  setSelectedFile(file);
                }}
              />

              {!selectedFile ? (
                <label
                  htmlFor="video-upload"
                  className="
                    flex
                    min-h-36
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-xl
                    border-2
                    border-dashed
                    border-gray-300
                    bg-white
                    text-sm
                    font-medium
                    text-gray-600
                    transition-all
                    duration-200
                    hover:border-gray-500
                    hover:bg-gray-50
                  "
                >
                  Click to choose a video
                </label>
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-5">

                  <p className="text-sm font-semibold text-gray-900">
                    Selected video
                  </p>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {selectedFile.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>

                  <div className="mt-5 flex gap-3">

                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={uploading}
                      className="
                        rounded-full
                        bg-black
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition-all
                        hover:bg-gray-800
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {uploading
                        ? "Uploading..."
                        : "Publish video"}
                    </button>

                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => {
                        setSelectedFile(null);

                        const input =
                          document.getElementById(
                            "video-upload"
                          ) as HTMLInputElement | null;

                        if (input) {
                          input.value = "";
                        }
                      }}
                      className="
                        rounded-full
                        border
                        border-gray-300
                        bg-white
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-gray-700
                        hover:bg-gray-100
                      "
                    >
                      Cancel
                    </button>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIDEO TITLE */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
                Channel
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Videos
              </h2>
            </div>

            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600">
              {videos.length}{" "}
              {videos.length === 1
                ? "video"
                : "videos"}
            </span>
          </div>

          {/* VIDEOS */}
          {videos.length === 0 ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
                  ▶
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  No videos yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {isOwner
                    ? "Upload your first video and it will appear here."
                    : "This channel hasn't uploaded any videos yet."}
                </p>

              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">

              {videos.map((video) => {
                const videoUrl = getVideoUrl(video);

                return (
                  <button
                    key={video._id}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/watch/${video._id}`
                      )
                    }
                    className="group block text-left"
                  >

                    <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 shadow-sm">

                      {videoUrl ? (
                        <video
                          src={videoUrl}
                          muted
                          preload="metadata"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          No preview
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 transition-all duration-200 group-hover:bg-black/10" />

                      <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-white">
                        Video
                      </div>

                    </div>

                    <div className="mt-3">

                      <h3 className="line-clamp-2 text-base font-semibold leading-6 text-gray-900 group-hover:text-blue-600">
                        {video.videotitle ||
                          "Untitled video"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {video.videochannel ||
                          channel.channelname}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {(video.views || 0).toLocaleString()} views
                      </p>

                    </div>

                  </button>
                );
              })}

            </div>
          )}
        </section>
      )}

      {/* HOME */}
      {activeTab === "Home" && (
        <section className="mx-auto max-w-6xl px-8 py-16 text-center">
          <h2 className="text-2xl font-bold">
            {channel.channelname}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            Welcome to this channel. Explore videos
            uploaded by this creator.
          </p>
        </section>
      )}

      {/* SHORTS */}
      {activeTab === "Shorts" && (
        <section className="py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
            ▶
          </div>

          <h2 className="mt-5 text-xl font-bold">
            No Shorts yet
          </h2>
        </section>
      )}

      {/* PLAYLISTS */}
      {activeTab === "Playlists" && (
        <section className="py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
            ☰
          </div>

          <h2 className="mt-5 text-xl font-bold">
            No playlists yet
          </h2>
        </section>
      )}

      {/* COMMUNITY */}
      {activeTab === "Community" && (
        <section className="py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
            💬
          </div>

          <h2 className="mt-5 text-xl font-bold">
            No community posts yet
          </h2>
        </section>
      )}

      {/* ABOUT */}
      {activeTab === "About" && (
        <section className="mx-auto max-w-6xl px-8 py-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold">
              About
            </h2>

            <div className="mt-6 rounded-2xl border border-gray-200 p-6">
              <p className="text-sm leading-6 text-gray-600">
                {channel.description ||
                  "This channel has not added a description yet."}
              </p>

              {channel.email && (
                <p className="mt-5 text-sm text-gray-600">
                  Contact: {channel.email}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

    </main>
  );
};

export default ChannelPage;