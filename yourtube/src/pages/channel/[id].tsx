import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { UserContext } from "@/lib/AuthContext";
import { toast } from "sonner";

interface Video {
  _id: string;
  videotitle: string;
  videochannel: string;
  views: number;
  thumbnail?: string;
}

interface ChannelData {
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

  const [channel, setChannel] = useState<ChannelData | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Videos");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchChannelAndVideos = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/channel/${id}`);
        setChannel(res.data.channel);
        setVideos(res.data.videos || []);
      } catch (err) {
        console.error("Fetch channel failed:", err);
        toast.error("Failed to load channel");
      } finally {
        setLoading(false);
      }
    };

    fetchChannelAndVideos();
  }, [id]);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a video");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("videotitle", selectedFile.name);
      formData.append("videochannel", channel?.channelname || "");
      formData.append("uploader", channel?._id || "");

      const res = await axiosInstance.post("/video/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Video uploaded successfully!");
      setSelectedFile(null);

      // Refresh channel videos
      const videoRes = await axiosInstance.get(`/channel/${id}`);
      setChannel(videoRes.data.channel);
      setVideos(videoRes.data.videos || []);
    } catch (error: any) {
      console.error("UPLOAD ERROR:", error.response?.data || error.message);
      toast.error("Upload failed");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-zinc-950">
        <p className="text-sm font-medium animate-pulse">Loading channel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-start gap-6">
          <div className="h-28 w-28 rounded-full bg-zinc-100 border flex items-center justify-center text-4xl text-zinc-600">
            {channel?.channelname?.charAt(0).toUpperCase() || "C"}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{channel?.channelname}</h1>
            <p className="text-sm text-zinc-500">@{channel?.channelname?.toLowerCase().replace(/\s+/g, "")}</p>
            <p className="text-xs text-zinc-400">{channel?.description}</p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full">Subscribe</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 border-b">
        <div className="flex gap-6 text-sm font-semibold text-zinc-500">
          {["Home", "Videos", "Shorts", "Playlists", "Community", "About"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 ${activeTab === tab ? "text-black border-b-2 border-zinc-900" : "hover:text-zinc-800"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Upload */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
        {!selectedFile ? (
          <label htmlFor="video-upload" className="block border p-10 text-center cursor-pointer">
            Click to upload a video
          </label>
        ) : (
          <div>
            <p>File: {selectedFile.name}</p>
            <button onClick={handleUpload} className="bg-black text-white px-4 py-2 rounded">Publish</button>
          </div>
        )}
      </div>

      {/* Videos */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <h2 className="text-base font-bold mb-4">Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video._id} onClick={() => router.push(`/watch/${video._id}`)} className="cursor-pointer">
              <div className="aspect-video bg-zinc-200 rounded-xl"></div>
              <h3 className="font-semibold text-sm">{video.videotitle}</h3>
              <p className="text-xs text-zinc-500">{video.videochannel}</p>
              <p className="text-xs text-zinc-400">{video.views} views</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
