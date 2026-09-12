import React, { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";

type Video = {
  _id: string;
  filename: string;
  filepath?: string;
  videotitle: string;
  videochannel?: string;
  views?: number;
  createdAt?: string;
};

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axiosInstance.get("/video/getall");

        if (Array.isArray(response.data)) {
          setVideos(response.data);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const getVideoUrl = (video: Video) => {
    const path = video.filepath || `/uploads/${video.filename}`;

    if (path.startsWith("http")) {
      return path;
    }

    return `${backendUrl}${path}`;
  };

  return (
    <div className="min-h-screen bg-white px-6 py-6">
      {/* PAGE TITLE */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Recommended videos
        </h1>

        <p className="text-gray-500 mt-1">
          Watch the latest videos uploaded to YourTube.
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500">
            Loading videos...
          </p>
        </div>
      )}

      {/* NO VIDEOS */}
      {!loading && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-5">
            ▶️
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            No videos uploaded yet
          </h2>

          <p className="text-gray-500 mt-2">
            Uploaded videos will appear here.
          </p>
        </div>
      )}

      {/* VIDEOS */}
      {!loading && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <Link
              href={`/watch/${video._id}`}
              key={video._id}
              className="group block"
            >
              <div className="rounded-xl overflow-hidden bg-gray-100 aspect-video">
                <video
                  src={getVideoUrl(video)}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
              </div>

              <div className="pt-3">
                <h2 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600">
                  {video.videotitle}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {video.videochannel || "YourTube Channel"}
                </p>

                <p className="text-sm text-gray-500">
                  {video.views || 0} views
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;