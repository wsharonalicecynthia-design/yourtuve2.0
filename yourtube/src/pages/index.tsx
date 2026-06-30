import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "@/lib/axiosInstance";
import RelatedVideos from "@/components/ui/RelatedVideos";
import { UserContext } from "@/lib/AuthContext";

type Video = {
  _id: string;
  filename: string;
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
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Please sign in to view your history.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">History</h1>

      {videos.length > 0 ? (
        <RelatedVideos videos={videos} />
      ) : (
        <p className="text-gray-500">No watch history yet.</p>
      )}
    </div>
  );
};

export default HistoryPage;