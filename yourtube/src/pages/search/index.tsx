import { useRouter } from "next/router";
import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "@/lib/axiosInstance";

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query;

  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = useMemo(() => {
    if (!q) return "";
    return Array.isArray(q) ? q[0] : q;
  }, [q]);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");
        setVideos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [router.isReady]);

  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;

    return videos.filter((video: any) => {
      const title = (video.videotitle || "").toLowerCase();
      const channel = (
        video.videochannel ||
        video.videochanel ||
        ""
      ).toLowerCase();

      return (
        title.includes(searchQuery.toLowerCase()) ||
        channel.includes(searchQuery.toLowerCase())
      );
    });
  }, [videos, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading search results...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {searchQuery && (
        <h1 className="text-2xl font-semibold mb-6">
          Search results for "{searchQuery}"
        </h1>
      )}

      {filteredVideos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No videos found.
        </div>
      ) : (
        <div className="space-y-5">
          {filteredVideos.map((video: any) => (
            <div
              key={video._id}
              onClick={() => router.push(`/watch/${video._id}`)}
              className="flex gap-4 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition"
            >
              <div className="w-80 h-44 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.videotitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-medium">
                  {video.videotitle}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  {(video.views || 0).toLocaleString()} views
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  {video.videochannel || video.videochanel || "Unknown Channel"}
                </p>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {video.description || "No description available."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;