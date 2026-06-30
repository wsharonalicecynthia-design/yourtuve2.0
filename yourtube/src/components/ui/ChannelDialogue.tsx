"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent, useContext } from "react";
import { useRouter } from "next/navigation"; 
import axiosInstance from "@/lib/axiosInstance"; 
import { UserContext } from "@/lib/AuthContext"; 

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ChannelDialogueProps {
  isopen: boolean;
  onclose: () => void;
  channeldata: any;
  mode: "create" | "edit";
}

const ChannelDialogue: React.FC<ChannelDialogueProps> = ({
  isopen,
  onclose,
  channeldata,
  mode,
}) => {
  const router = useRouter();
  
  const context = useContext(UserContext);
  const user = context?.user; 
  const login = context?.login;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (channeldata && mode === "edit") {
      setFormData({
        name: channeldata.channelname || channeldata.name || "",
        description: channeldata.description || "",
      });
    } else {
      setFormData({
        name: user?.name || "",
        description: "",
      });
    }
  }, [channeldata, mode, user]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user?._id && !user?.id) {
      console.error("No active user found.");
      return;
    }

    setIsSubmitting(true);
    
    const payload = {
      channelname: formData.name,
      description: formData.description,
    };

    try {
      const userId = user?._id || user?.id; 
      
      // 🎯 FIXED: Uses PUT and references /user/update-profile path matching your backend controller
      const response = await axiosInstance.put(`/user/update-profile/${userId}`, payload);
      console.log("Channel profile successfully updated in MongoDB:", response.data);
      
      // 🎯 FIXED: Update global user auth context data safely
      if (login && response.data) {
        // If your backend returns the user inside { result: updatedUser }, use response.data.result
        const updatedUser = response.data.result || response.data;
        login(updatedUser);
      }
      
      // 🎯 FIXED: Fixed template literal syntax error strings
      router.push(`/channel/${userId}`);
      router.refresh(); 
      onclose();        
    } catch (error) {
      console.error("Error creating/updating channel:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isopen} onOpenChange={onclose}>
      <DialogContent className="bg-white text-black max-w-md rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "create" ? "Create your channel" : "Edit your channel"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
              Channel Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. My Awesome Channel"
              className="w-full text-black border-gray-300 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Channel Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell viewers about your content..."
              className="w-full text-black border-gray-300 focus:ring-blue-500 placeholder-gray-400"
              rows={4}
            />
          </div>

          <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={onclose}
              className="rounded-full font-medium text-gray-600 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelDialogue;