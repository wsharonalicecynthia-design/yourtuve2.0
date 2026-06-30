import React, { useRef, useState, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";

interface VideoUploaderProps {
  channelId: string;
  channelName: string;
  onUploadSuccess?: (video: any) => void;
}

const VideoUploader = ({
  channelId,
  channelName,
  onUploadSuccess,
}: VideoUploaderProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video size should be less than 100MB");
      return;
    }

    setVideoFile(file);
    setVideoTitle(file.name);

    toast.success(`Selected: ${file.name}`);
  };

  const resetForm = () => {
    setVideoFile(null);
    setVideoTitle("");
    setUploadProgress(0);
    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !videoTitle.trim()) {
      toast.error("Please provide file and title");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formdata = new FormData();

      // ✅ FIXED KEYS (IMPORTANT)
      formdata.append("file", videoFile);
      formdata.append("videotitle", videoTitle);
      formdata.append("videochannel", channelName);
      formdata.append("uploader", channelId);

      const res = await axiosInstance.post("/video/upload", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1;
          const percent = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percent);
        },
      });

      console.log("UPLOAD RESPONSE:", res.data);

      const newVideo = {
        _id: res.data?._id || Date.now().toString(),
        videotitle: videoTitle,
        videochannel: channelName,
        views: 0,
        filepath: res.data?.filepath || "",
        thumbnail: res.data?.thumbnail || "",
      };

      if (onUploadSuccess) {
        onUploadSuccess(newVideo);
      }

      toast.success("Video uploaded successfully!");
      resetForm();
    } catch (error: any) {
      console.error("UPLOAD ERROR:", error?.response?.data || error.message);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-50 border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Video</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!videoFile ? (
        <label
          htmlFor="video-upload"
          className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-gray-100 block"
        >
          <Upload className="mx-auto mb-3 h-10 w-10" />
          <p className="font-medium">Click to select a video</p>
          <p className="text-sm text-gray-500 mt-2">
            MP4, MOV, WEBM, AVI (Max 100MB)
          </p>
        </label>
      ) : (
        <div className="space-y-4">
          <div className="border rounded p-4">
            <p><strong>File:</strong> {videoFile.name}</p>
            <p><strong>Size:</strong> {(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Channel:</strong> {channelName}</p>
          </div>

          {isUploading && (
            <div>
              <p className="mb-2">Uploading: {uploadProgress}%</p>
              <div className="w-full bg-gray-200 rounded h-3">
                <div
                  className="bg-blue-500 h-3 rounded"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Publish"}
            </Button>

            <Button variant="outline" onClick={resetForm} disabled={isUploading}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;