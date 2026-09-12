import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Videocard from "@/components/ui/Videocard";

type Video = {
  _id: string;
  filename?: string;
  filepath?: string;
  videotitle?: string;
  videochannel?: string;
  views?: number;
  createdAt?: string;
  category?: string;
};

const categories = [
  "All",
  "Music",
  "Gaming",
  "Movies",
  "News",
  "Sports",
  "Technology",
  "Comedy",
  "Education",
  "Science",
  "Travel",
  "Food",
  "Fashion",
];

const ExplorePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
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
        console.error("Error fetching explore videos:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos =
    activeCategory === "All"
      ? videos
      : videos.filter(
          (video) =>
            video.category?.toLowerCase() ===
            activeCategory.toLowerCase()
        );

  return (
    <main className="min-h-screen bg-white">

      {/* Explore Header */}
      <div className="px-6 pt-7">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
            Discover
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Explore
          </h1>

          <p className="mt-1 text-gray-500">
            Discover videos from different categories.
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-black text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Videos */}
      <div className="px-6 pb-10 pt-5">

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

              <p className="mt-4 text-sm text-gray-500">
                Discovering videos...
              </p>
            </div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
              ✦
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              No videos found
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              There are no videos in this category yet.
              Upload some videos and they will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeCategory === "All"
                  ? "Trending videos"
                  : `${activeCategory} videos`}
              </h2>

              <span className="text-sm text-gray-500">
                {filteredVideos.length}{" "}
                {filteredVideos.length === 1
                  ? "video"
                  : "videos"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredVideos.map((video) => (
                <Videocard
                  key={video._id}
                  video={video}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ExplorePage;