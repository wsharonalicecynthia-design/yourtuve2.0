import React, { useEffect, useMemo, useState } from "react";
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

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const backendUrl = (
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "http://localhost:5000"
        ).replace(/\/$/, "");

        const response = await fetch(
          `${backendUrl}/video/getall`
        );

        if (!response.ok) {
          throw new Error(
            `Videos request failed: ${response.status}`
          );
        }

        const data = await response.json();

        setVideos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("HOME VIDEO ERROR:", error);
        setError("Unable to load videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    if (activeCategory === "All") {
      return videos;
    }

    return videos.filter(
      (video) =>
        video.category?.toLowerCase() ===
        activeCategory.toLowerCase()
    );
  }, [videos, activeCategory]);

  return (
    <main className="min-h-screen bg-white">

      {/* HEADER */}
      <section className="px-6 pt-8">
        <div className="animate-fade-in">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
            Welcome
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-gray-950">
            Home
          </h1>

          <p className="mt-2 text-base text-gray-500">
            Discover videos and watch what you love.
          </p>

        </div>
      </section>

      {/* CATEGORY TOGGLE */}
      <section className="px-6 pt-7">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">

          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  relative
                  whitespace-nowrap
                  rounded-full
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-300
                  ease-out
                  transform
                  ${
                    active
                      ? "bg-black text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }
                `}
              >
                {category}

                {/* Animated active indicator */}
                {active && (
                  <span
                    className="
                      absolute
                      inset-0
                      rounded-full
                      ring-2
                      ring-black/10
                      animate-pulse
                    "
                  />
                )}
              </button>
            );
          })}

        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 pb-12 pt-6">

        {/* SECTION TITLE */}
        <div className="mb-6 flex items-end justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-600">
              {activeCategory === "All"
                ? "Latest"
                : activeCategory}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {activeCategory === "All"
                ? "Recommended videos"
                : `${activeCategory} videos`}
            </h2>
          </div>

          {!loading && !error && videos.length > 0 && (
            <div
              key={filteredVideos.length}
              className="
                rounded-full
                bg-gray-100
                px-3
                py-1.5
                text-xs
                font-medium
                text-gray-600
                animate-fade-in
              "
            >
              {filteredVideos.length}{" "}
              {filteredVideos.length === 1
                ? "video"
                : "videos"}
            </div>
          )}

        </div>

        {/* LOADING ANIMATION */}
        {loading && (
          <div className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse"
              >
                <div className="aspect-video rounded-xl bg-gray-200" />

                <div className="mt-3 flex gap-3">

                  <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-200" />

                  <div className="flex-1">

                    <div className="h-4 w-11/12 rounded bg-gray-200" />

                    <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />

                    <div className="mt-2 h-3 w-2/3 rounded bg-gray-200" />

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="flex min-h-[420px] items-center justify-center">

            <div className="text-center animate-fade-in">

              <div className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-red-50
                text-2xl
                text-red-600
              ">
                !
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-900">
                Couldn't load videos
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Please check your connection and try again.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="
                  mt-5
                  rounded-full
                  bg-black
                  px-6
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  duration-300
                  hover:bg-gray-800
                  hover:scale-105
                  active:scale-95
                "
              >
                Try again
              </button>

            </div>

          </div>
        )}

        {/* NO VIDEOS */}
        {!loading &&
          !error &&
          filteredVideos.length === 0 && (
            <div
              key={activeCategory}
              className="
                flex
                min-h-[420px]
                flex-col
                items-center
                justify-center
                text-center
                animate-fade-in
              "
            >

              <div
                className="
                  mb-5
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  text-4xl
                  transition-all
                  duration-500
                  hover:scale-110
                  hover:rotate-12
                "
              >
                ✦
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                No videos found
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                {activeCategory === "All"
                  ? "Upload your first video and it will appear here."
                  : `There are no ${activeCategory.toLowerCase()} videos yet.`}
              </p>

            </div>
          )}

        {/* VIDEOS */}
        {!loading &&
          !error &&
          filteredVideos.length > 0 && (
            <div
              key={activeCategory}
              className="
                grid
                grid-cols-1
                gap-x-5
                gap-y-9
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                animate-fade-in
              "
            >

              {filteredVideos.map((video, index) => (
                <div
                  key={video._id}
                  className="animate-slide-up"
                  style={{
                    animationDelay: `${index * 60}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <Videocard video={video} />
                </div>
              ))}

            </div>
          )}

      </section>
    </main>
  );
};

export default HomePage;