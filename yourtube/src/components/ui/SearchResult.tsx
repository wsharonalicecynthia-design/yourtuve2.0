import React, { useState, useEffect } from "react";

// Put this outside your component
interface Video {
  _id: string;
  videotitle: string;
  filename: string;
  filetype: string;
  filepath: string;
  filesize: string;
  videochannel: string;
  Like: number;
  views: number;
  uploader: string;
  createdAt: string;
}

interface SearchResultProps {
  query: string;
}

function SearchResult({ query }: SearchResultProps) {
  const [videos, setVideos] = useState<Video[] | null>(null);

  const fetchVideos = async () => {
    const allVideos = [
      {
        _id: "1",
        videotitle: "Amazing Nature Documentary",
        filename: "nature-doc.mp4",
        filetype: "video/mp4",
        filepath: "/videos/nature-doc.mp4",
        filesize: "500MB",
        videochannel: "Nature Channel",
        Like: 1250,
        views: 45000,
        uploader: "nature_lover",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        videotitle: "Cooking Tutorial: Perfect Pasta",
        filename: "pasta-tutorial.mp4",
        filetype: "video/mp4",
        filepath: "/videos/pasta-tutorial.mp4",
        filesize: "300MB",
        videochannel: "Chef's Kitchen",
        Like: 890,
        views: 23000,
        uploader: "chef_master",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    let results = allVideos.filter(
      (vid) => vid.videotitle.toLowerCase().includes(query.toLowerCase()) ||
        vid.videochannel.toLowerCase().includes(query.toLowerCase())
    );
    setVideos(results);
  };

  useEffect(() => {
    fetchVideos();
  }, [query]);

  if (!videos) return <div className="text-gray-500">Loading results...</div>;
  if (videos.length === 0) return <div className="py-8 text-gray-500">No videos found.</div>;

  return (
    <div className="grid grid-cols-1 gap-4 mt-4 max-w-4xl">
      {videos.map((vid) => (
        <div key={vid._id} className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-black">
          <h3 className="font-semibold text-lg">{vid.videotitle}</h3>
          <p className="text-sm text-gray-600">{vid.videochannel}</p>
          <p className="text-xs text-gray-400 mt-1">{vid.views.toLocaleString()} views</p>
        </div>
      ))}
    </div>
  );
}

export default SearchResult;