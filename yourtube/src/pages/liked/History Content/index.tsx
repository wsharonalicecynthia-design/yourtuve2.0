import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "@/lib/axiosInstance";
import RelatedVideos from "@/components/ui/RelatedVideos";
import { UserContext } from "@/lib/AuthContext";

type Video = {
  _id: string;
  filename: string;
  filepath?: string;
  videotitle: string;
  videochannel?: string;
  views?: number;
};

const HistoryPage: React.FC = () => {
  const { user } = useContext(UserContext) || {};

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get(`/history/${user._id}`);

        if (Array.isArray(res.data)) {
          setVideos(
            res.data
              .filter((item: any) => item.videoId)
              .map((item: any) => item.videoId)
          );
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="history-loader"></div>
          <p className="mt-4 text-gray-500">
            Loading your history...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="history-empty text-center">
          <div className="history-icon">🕘</div>

          <h1 className="text-2xl font-bold text-gray-900">
            Sign in to view your history
          </h1>

          <p className="text-gray-500 mt-2">
            Your recently watched videos will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="history-header px-6 py-8">
        <div>
          <p className="history-label text-red-600 font-semibold tracking-widest">
            YOUR ACTIVITY
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Watch History
          </h1>

          <p className="text-gray-500 mt-1">
            Revisit the videos you've watched recently.
          </p>
        </div>

        {videos.length > 0 && (
          <div className="history-count">
            {videos.length}{" "}
            {videos.length === 1 ? "video" : "videos"}
          </div>
        )}
      </div>

      <div className="px-6 pb-10">
        {videos.length > 0 ? (
          <RelatedVideos videos={videos} />
        ) : (
          <div className="history-empty min-h-[450px] flex flex-col items-center justify-center text-center">
            <div className="empty-circle text-5xl mb-5">
              🕘
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              No watch history yet
            </h2>

            <p className="text-gray-500 mt-2 max-w-md">
              Videos you watch will appear here, so you can
              easily find them again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;