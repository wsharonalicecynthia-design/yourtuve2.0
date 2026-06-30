"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";

interface ChannelHeaderProps {
  channelId: string;
  isOwnChannel: boolean;
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channelId, isOwnChannel }) => {
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (!channelId) return;

    const fetchChannel = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/profile/${channelId}`);
        // Ensure you are setting the data correctly
        setChannel(response.data);
      } catch (err) {
        console.error("Failed to load channel data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [channelId]);

  // 1. Loading State
  if (loading) return <div className="p-6 h-32 animate-pulse bg-gray-100 rounded-lg">Loading...</div>;

  // 2. Error/Empty State
  if (!channel) return <div className="p-6 text-gray-500">Channel not found.</div>;

  return (
    <div className="flex items-center gap-6 p-6 bg-white border-b">
      <Avatar className="h-24 w-24">
        {/* Use optional chaining to prevent undefined errors */}
        <AvatarImage src={channel?.profilepic} alt={channel?.channelname || "Channel"} />
        <AvatarFallback>{channel?.channelname?.[0] || "C"}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <h1 className="text-2xl font-bold">{channel?.channelname || "Unnamed Channel"}</h1>
        <p className="text-gray-600 mt-1">{channel?.description || "No description provided."}</p>
      </div>

      {isOwnChannel && (
        <Button variant="outline" onClick={() => console.log("Edit triggered")}>
          Customize Channel
        </Button>
      )}
    </div>
  );
};

export default ChannelHeader;