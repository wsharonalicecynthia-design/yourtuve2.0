"use client";

import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/router";

import Link from "next/link";

import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Clock,
} from "lucide-react";

import {
  toast,
} from "sonner";

import axiosInstance from "@/lib/axiosInstance";

import {
  UserContext,
} from "@/lib/AuthContext";

import Comments from "@/components/ui/comments";
import RelatedVideos from "@/components/ui/RelatedVideos";


interface Video {
  _id: string;
  videotitle?: string;
  videochannel?: string;
  filename?: string;
  filepath?: string;
  filetype?: string;
  filesize?: number;
  uploader?: string;
  uploaderCity?: string;
  views?: number;
  like?: number;
  dislike?: number;
  createdAt?: string;
}


const WatchPage = () => {

  const router = useRouter();

  const context =
    useContext(UserContext);

  const user =
    context?.user;


  const [video, setVideo] =
    useState<Video | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [relatedVideos, setRelatedVideos] =
    useState<Video[]>([]);

  const [subscribed, setSubscribed] =
    useState(false);

  const [checkingSubscription, setCheckingSubscription] =
    useState(false);


  const videoId =
    router.query.id;


  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5000";


  /*
  ==================================================
  FETCH VIDEO
  ==================================================
  */

  useEffect(() => {

    if (
      !router.isReady ||
      typeof videoId !== "string"
    ) {
      return;
    }

    const fetchVideo =
      async () => {

        try {

          setLoading(true);

          const response =
            await axiosInstance.get(
              `/video/${videoId}`
            );

          console.log(
            "VIDEO RESPONSE:",
            response.data
          );

          setVideo(
            response.data
          );

        } catch (error) {

          console.error(
            "FETCH VIDEO ERROR:",
            error
          );

          toast.error(
            "Unable to load video"
          );

        } finally {

          setLoading(false);

        }

      };

    fetchVideo();

  }, [
    router.isReady,
    videoId,
  ]);


  /*
  ==================================================
  ADD VIDEO TO HISTORY
  ==================================================
  */

  const addToHistory =
    async () => {

      if (
        !user?._id ||
        !video?._id
      ) {

        console.log(
          "HISTORY NOT ADDED:",
          {
            userId:
              user?._id,

            videoId:
              video?._id,
          }
        );

        return;
      }

      try {

        console.log(
          "ADDING VIDEO TO HISTORY:",
          {
            userId:
              user._id,

            videoId:
              video._id,
          }
        );


        const response =
          await axiosInstance.post(
            "/history",
            {
              viewer:
                String(user._id),

              videoid:
                String(video._id),
            }
          );


        console.log(
          "VIDEO ADDED TO HISTORY:",
          response.data
        );


      } catch (error: any) {

        console.error(
          "HISTORY ERROR:",
          error?.response?.data ||
            error
        );

      }

    };


  /*
  ==================================================
  ADD TO HISTORY WHEN VIDEO IS LOADED
  ==================================================
  */

  useEffect(() => {

    if (
      !user?._id ||
      !video?._id
    ) {
      return;
    }

    addToHistory();

  }, [
    user?._id,
    video?._id,
  ]);


  /*
  ==================================================
  FETCH RELATED VIDEOS
  ==================================================
  */

  useEffect(() => {

    if (!video?._id) {
      return;
    }

    const fetchRelatedVideos =
      async () => {

        try {

          const response =
            await axiosInstance.get(
              "/video/getall"
            );


          const allVideos =
            Array.isArray(
              response.data
            )
              ? response.data
              : Array.isArray(
                  response.data?.videos
                )
              ? response.data.videos
              : [];


          const filtered =
            allVideos
              .filter(
                (item: Video) =>
                  String(item._id) !==
                  String(video._id)
              )
              .slice(0, 10);


          setRelatedVideos(
            filtered
          );


        } catch (error) {

          console.error(
            "RELATED VIDEOS ERROR:",
            error
          );

          setRelatedVideos([]);

        }

      };


    fetchRelatedVideos();

  }, [
    video?._id,
  ]);


  /*
  ==================================================
  CHECK SUBSCRIPTION
  ==================================================
  */

  useEffect(() => {

    if (
      !user?._id ||
      !video?.uploader
    ) {
      return;
    }


    if (
      String(user._id) ===
      String(video.uploader)
    ) {

      setSubscribed(false);

      return;
    }


    const checkSubscription =
      async () => {

        try {

          setCheckingSubscription(
            true
          );


          const response =
            await axiosInstance.get(
              `/subscription/check/${user._id}/${video.uploader}`
            );


          setSubscribed(
            Boolean(
              response.data?.subscribed
            )
          );


        } catch (error) {

          console.error(
            "CHECK SUBSCRIPTION ERROR:",
            error
          );


        } finally {

          setCheckingSubscription(
            false
          );

        }

      };


    checkSubscription();

  }, [
    user?._id,
    video?.uploader,
  ]);


  /*
  ==================================================
  SUBSCRIBE / UNSUBSCRIBE
  ==================================================
  */

  const handleSubscribe =
    async () => {

      if (!user?._id) {

        toast.error(
          "Please sign in first"
        );

        return;
      }


      if (!video?.uploader) {

        toast.error(
          "Channel information unavailable"
        );

        return;
      }


      if (
        String(user._id) ===
        String(video.uploader)
      ) {

        toast.error(
          "You cannot subscribe to your own channel"
        );

        return;
      }


      try {

        if (subscribed) {

          await axiosInstance.delete(
            `/subscription/${user._id}/${video.uploader}`
          );


          setSubscribed(false);


          toast.success(
            "Unsubscribed"
          );


        } else {

          await axiosInstance.post(
            "/subscription",
            {
              subscriber:
                user._id,

              channel:
                video.uploader,
            }
          );


          setSubscribed(true);


          toast.success(
            "Subscribed successfully"
          );

        }


      } catch (error) {

        console.error(
          "SUBSCRIPTION ERROR:",
          error
        );


        toast.error(
          "Unable to update subscription"
        );

      }

    };


  /*
  ==================================================
  SHARE
  ==================================================
  */

  const handleShare =
    async () => {

      try {

        const url =
          window.location.href;


        if (
          navigator.share
        ) {

          await navigator.share({
            title:
              video?.videotitle ||
              "Video",

            url,
          });


        } else {

          await navigator.clipboard.writeText(
            url
          );


          toast.success(
            "Video link copied"
          );

        }


      } catch (error) {

        console.error(
          "SHARE ERROR:",
          error
        );

      }

    };


  /*
  ==================================================
  LOADING
  ==================================================
  */

  if (loading) {

    return (
      <main className="min-h-screen bg-white p-6">

        <div className="mx-auto max-w-7xl">

          <div className="aspect-video w-full animate-pulse rounded-xl bg-gray-100" />

          <div className="mt-5 h-8 w-2/3 animate-pulse rounded bg-gray-100" />

          <div className="mt-3 h-5 w-1/3 animate-pulse rounded bg-gray-100" />

        </div>

      </main>
    );

  }


  /*
  ==================================================
  VIDEO NOT FOUND
  ==================================================
  */

  if (!video) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-white">

        <div className="text-center">

          <h1 className="text-xl font-semibold text-gray-900">
            Video not found
          </h1>


          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            Back to Home
          </Link>

        </div>

      </main>
    );

  }


  /*
  ==================================================
  VIDEO STREAM URL
  ==================================================
  */

  const videoUrl =
    `${backendUrl}/video/stream/${video._id}`;


  /*
  ==================================================
  CHECK OWNER
  ==================================================
  */

  const isOwnChannel =
    Boolean(
      user?._id &&
      video.uploader &&
      String(user._id) ===
        String(video.uploader)
    );


  /*
  ==================================================
  PAGE
  ==================================================
  */

  return (
    <main className="min-h-screen bg-white">

      <div className="mx-auto max-w-7xl px-6 py-6">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">


          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <div className="min-w-0">


            {/* ==================================================
                VIDEO PLAYER
            ================================================== */}

            <div className="overflow-hidden rounded-xl bg-black shadow-sm">

              <video
                key={videoUrl}
                src={videoUrl}
                controls
                playsInline
                preload="metadata"
                className="block aspect-video w-full bg-black object-contain"

                /*
                  ADD TO HISTORY
                  WHEN USER PRESSES PLAY
                */

                onPlay={() => {

                  console.log(
                    "VIDEO PLAYED - ADDING TO HISTORY"
                  );

                  addToHistory();

                }}

                onLoadedMetadata={(
                  event
                ) => {

                  console.log(
                    "VIDEO LOADED"
                  );

                  console.log(
                    "DURATION:",
                    event.currentTarget.duration
                  );

                }}

                onError={(event) => {

                  console.error(
                    "VIDEO URL:",
                    videoUrl
                  );

                  console.error(
                    "VIDEO ERROR:",
                    event.currentTarget.error
                  );

                }}

              />

            </div>


            {/* ==================================================
                TITLE
            ================================================== */}

            <h1 className="mt-6 text-2xl font-bold leading-tight text-gray-900">

              {video.videotitle ||
                "Untitled video"}

            </h1>


            {/* ==================================================
                CHANNEL + VIEWS
            ================================================== */}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <Link
                  href={
                    video.uploader
                      ? `/channel/${video.uploader}`
                      : "#"
                  }
                  className="font-bold text-gray-900 hover:text-blue-600"
                >

                  {video.videochannel ||
                    "YourTube"}

                </Link>


                {!isOwnChannel && (

                  <button
                    type="button"
                    onClick={
                      handleSubscribe
                    }
                    disabled={
                      checkingSubscription
                    }
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                      subscribed
                        ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >

                    {checkingSubscription
                      ? "Loading..."
                      : subscribed
                      ? "Subscribed"
                      : "Subscribe"}

                  </button>

                )}

              </div>


              <p className="text-sm text-gray-500">

                {(video.views || 0).toLocaleString()}{" "}
                views

                {video.createdAt &&
                  ` • ${new Date(
                    video.createdAt
                  ).toLocaleDateString()}`}

              </p>

            </div>


            {/* ==================================================
                ACTION BUTTONS
            ================================================== */}

            <div className="mt-5 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "Like feature connected separately"
                  )
                }
                className="flex items-center gap-2 rounded-full bg-gray-100 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >

                <ThumbsUp className="h-5 w-5" />

                {video.like || 0}

              </button>


              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "Dislike feature connected separately"
                  )
                }
                className="flex items-center gap-2 rounded-full bg-gray-100 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >

                <ThumbsDown className="h-5 w-5" />

                {video.dislike || 0}

              </button>


              <button
                type="button"
                onClick={
                  handleShare
                }
                className="flex items-center gap-2 rounded-full bg-gray-100 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >

                <Share2 className="h-5 w-5" />

                Share

              </button>


              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "Watch later feature connected separately"
                  )
                }
                className="flex items-center gap-2 rounded-full bg-gray-100 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200"
              >

                <Clock className="h-5 w-5" />

                Watch later

              </button>

            </div>


            {/* ==================================================
                CHANNEL DESCRIPTION
            ================================================== */}

            <div className="mt-7 rounded-2xl bg-gray-100 p-6">

              <Link
                href={
                  video.uploader
                    ? `/channel/${video.uploader}`
                    : "#"
                }
                className="text-lg font-bold text-gray-900 hover:text-blue-600"
              >

                {video.videochannel ||
                  "YourTube"}

              </Link>


              <p className="mt-3 text-sm leading-6 text-gray-600">

                Watch this video uploaded by{" "}

                {video.videochannel ||
                  "YourTube"}.

              </p>

            </div>


            {/* ==================================================
                COMMENTS
            ================================================== */}

            <Comments
              videoId={video._id}
            />

          </div>


          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <aside className="hidden lg:block">

            <div className="sticky top-4">

              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Recommended
              </h2>


              <RelatedVideos
                videos={relatedVideos}
              />

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
};


export default WatchPage;