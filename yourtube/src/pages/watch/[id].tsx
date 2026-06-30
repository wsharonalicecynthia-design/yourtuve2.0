import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/lib/axiosInstance";
import { UserContext } from "@/lib/AuthContext";

import Videoplayer from "@/components/ui/Videoplayer";
import VideoInfo from "@/components/ui/videoinfo";
import Comments from "@/components/ui/comments";
import RelatedVideos from "@/components/ui/RelatedVideos";

const WatchPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useContext(UserContext) || {};

  const [videos, setVideos] = useState<any[]>([]);
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");

        setVideos(res.data);

        const selectedVideo = res.data.find(
          (v: any) => v._id === id
        );

        if (!selectedVideo) {
          setVideo(null);
          return;
        }

        setVideo(selectedVideo);

        // Save to history after opening the video
        if (user?._id) {
          try {
            await axiosInstance.post("/history", {
              userId: user._id,
              videoId: selectedVideo._id,
            });
          } catch (historyError) {
            console.error("History save failed:", historyError);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [router.isReady, id, user]);

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  if (!video) {
    return <div className="p-5">Video not found.</div>;
  }

  return (
    <div className="max-w-screen-2xl mx-auto p-6 flex gap-6">
      <div className="flex-1">
        <Videoplayer video={video} />

        <div className="mt-4">
          <VideoInfo video={video} />
        </div>

        <div className="mt-6">
          <Comments videoId={video._id} />
        </div>
      </div>

      <div className="w-[380px]">
        <RelatedVideos
          videos={videos.filter((v: any) => v._id !== video._id)}
        />
      </div>
    </div>
  );
};

export default WatchPage;