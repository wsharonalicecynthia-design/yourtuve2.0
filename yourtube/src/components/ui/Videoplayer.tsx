import React from "react";

// Changed prop from { videoUrl } to { video }
const Videoplayer = ({ video }: { video?: any }) => {
  
  // If no video object is provided, show a placeholder
  if (!video) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-gray-500">
        No video selected
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        className="w-full h-full"
        controls
        // Using the filepath as a unique key for the video element
        key={video?.filepath}
      >
        {/* THIS IS THE EXACT LINE YOU WANTED */}
        <source 
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${video?.filepath}`} 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Videoplayer;