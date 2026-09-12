"use client";

import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { formatDistanceToNow } from "date-fns";

import axiosInstance from "@/lib/axiosInstance";
import { UserContext } from "@/lib/AuthContext";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentItem {
  _id: string;

  comment?: string;
  commentbody?: string;

  viewer?: {
    _id?: string;
    name?: string;
    email?: string;
    image?: string;
  };

  usercommented?: string;
  userid?: string;

  createdAt: string;

  city?: string;
  language?: string;

  likes?: string[];
  dislikes?: string[];

  userimage?: string;
}

interface CommentsProps {
  videoId: string;
}

const Comments = ({
  videoId,
}: CommentsProps) => {
  const context = useContext(UserContext);

  const user = context?.user;

  const [comments, setComments] =
    useState<CommentItem[]>([]);

  const [newComment, setNewComment] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /*
    LOAD COMMENTS
  */

  useEffect(() => {
    if (!videoId) {
      return;
    }

    fetchComments();
  }, [videoId]);


  const fetchComments = async () => {
    try {
      const res =
        await axiosInstance.get(
          `/comment/${videoId}`
        );

      console.log(
        "COMMENTS LOADED:",
        res.data
      );

      setComments(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err: any) {
      console.error(
        "FETCH COMMENTS ERROR:",
        err?.response?.data || err
      );

      setComments([]);
    }
  };


  /*
    PREVENT SPECIAL CHARACTERS
  */

  const containsSpecialCharacters = (
    text: string
  ) => {
    return /[!@#$%^&*(),.?":{}|<>]/.test(
      text
    );
  };


  /*
    ADD COMMENT
  */

  const handleSubmitComment = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    /*
      Check login
    */

    if (!user?._id) {
      alert(
        "Please login before commenting."
      );
      return;
    }

    /*
      Check video
    */

    if (!videoId) {
      alert(
        "Video ID is missing."
      );
      return;
    }

    /*
      Check comment
    */

    const commentText =
      newComment.trim();

    if (!commentText) {
      return;
    }

    /*
      Check special characters
    */

    if (
      containsSpecialCharacters(
        commentText
      )
    ) {
      alert(
        "Special characters are not allowed."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(
        "ADDING COMMENT:"
      );

      console.log({
        viewer: user._id,
        videoid: videoId,
        comment: commentText,
      });


      /*
        IMPORTANT:
        Send exactly what backend expects
      */

      const response =
        await axiosInstance.post(
          "/comment",
          {
            viewer: String(user._id),

            videoid: String(videoId),

            comment: commentText,
          }
        );


      console.log(
        "COMMENT ADDED:",
        response.data
      );


      /*
        Clear textbox
      */

      setNewComment("");


      /*
        Reload comments
      */

      await fetchComments();

    } catch (err: any) {
      console.error(
        "COMMENT ERROR:",
        err?.response?.data || err
      );

      alert(
        err?.response?.data?.message ||
        "Failed to add comment."
      );

    } finally {
      setIsSubmitting(false);
    }
  };


  /*
    LIKE COMMENT

    NOTE:
    These routes need to exist in your
    backend before these buttons work.
  */

  const likeComment = async (
    id: string
  ) => {
    if (!user?._id) {
      alert(
        "Please login first."
      );
      return;
    }

    try {
      await axiosInstance.post(
        `/comment/like/${id}`,
        {
          userId: user._id,
        }
      );

      await fetchComments();

    } catch (err: any) {
      console.error(
        "LIKE COMMENT ERROR:",
        err?.response?.data || err
      );
    }
  };


  /*
    DISLIKE COMMENT
  */

  const dislikeComment = async (
    id: string
  ) => {
    if (!user?._id) {
      alert(
        "Please login first."
      );
      return;
    }

    try {
      await axiosInstance.post(
        `/comment/dislike/${id}`,
        {
          userId: user._id,
        }
      );

      await fetchComments();

    } catch (err: any) {
      console.error(
        "DISLIKE COMMENT ERROR:",
        err?.response?.data || err
      );
    }
  };


  /*
    TRANSLATE COMMENT
  */

  const translateComment = async (
    id: string
  ) => {
    const lang = prompt(
      "Enter language code (en, hi, ta, ml)"
    );

    if (!lang) {
      return;
    }

    try {
      const res =
        await axiosInstance.post(
          `/comment/translate/${id}`,
          {
            language: lang,
          }
        );

      alert(
        res.data.translation
      );

    } catch (err: any) {
      console.error(
        "TRANSLATE COMMENT ERROR:",
        err?.response?.data || err
      );

      alert(
        err?.response?.data?.message ||
        "Translation failed."
      );
    }
  };


  /*
    GET COMMENT DISPLAY NAME
  */

  const getCommentName = (
    comment: CommentItem
  ) => {
    return (
      comment.viewer?.name ||
      comment.usercommented ||
      "User"
    );
  };


  /*
    GET COMMENT IMAGE
  */

  const getCommentImage = (
    comment: CommentItem
  ) => {
    return (
      comment.viewer?.image ||
      comment.userimage ||
      ""
    );
  };


  /*
    GET COMMENT TEXT
  */

  const getCommentText = (
    comment: CommentItem
  ) => {
    return (
      comment.comment ||
      comment.commentbody ||
      ""
    );
  };


  /*
    RENDER
  */

  return (
    <div className="w-full">

      <h2 className="text-lg font-bold mb-4">
        {comments.length} Comments
      </h2>


      <form
        onSubmit={
          handleSubmitComment
        }
        className="flex gap-4 items-start mb-8"
      >

        <Avatar className="h-10 w-10">

          <AvatarImage
            src={
              user?.image ||
              "https://github.com/shadcn.png"
            }
            alt={
              user?.name ||
              "User"
            }
          />

          <AvatarFallback>
            {(
              user?.name ||
              "U"
            )[0].toUpperCase()}
          </AvatarFallback>

        </Avatar>


        <div className="flex-1 space-y-2">

          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) =>
              setNewComment(
                e.target.value
              )
            }
            className="min-h-[80px]"
          />


          <div className="flex justify-end gap-2">

            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setNewComment("")
              }
            >
              Cancel
            </Button>


            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !newComment.trim() ||
                !user?._id
              }
            >
              {isSubmitting
                ? "Posting..."
                : "Comment"}
            </Button>

          </div>

        </div>

      </form>


      <div className="space-y-6">

        {comments.map(
          (comment) => (

            <div
              key={comment._id}
              className="flex gap-4 border-b pb-4"
            >

              <Avatar className="h-10 w-10">

                <AvatarImage
                  src={getCommentImage(
                    comment
                  )}
                />

                <AvatarFallback>
                  {getCommentName(
                    comment
                  )[0]?.toUpperCase()}
                </AvatarFallback>

              </Avatar>


              <div className="flex-1">

                <div className="flex items-center gap-3 text-sm">

                  <span className="font-semibold">
                    {getCommentName(
                      comment
                    )}
                  </span>


                  {comment.city && (
                    <span className="text-gray-500">
                      📍{" "}
                      {comment.city}
                    </span>
                  )}


                  <span className="text-gray-400">

                    {comment.createdAt
                      ? `${formatDistanceToNow(
                          new Date(
                            comment.createdAt
                          )
                        )} ago`
                      : ""}

                  </span>

                </div>


                <p className="mt-2">
                  {getCommentText(
                    comment
                  )}
                </p>


                <div className="flex gap-3 mt-3">

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      likeComment(
                        comment._id
                      )
                    }
                  >
                    👍{" "}
                    {comment.likes
                      ?.length || 0}
                  </Button>


                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      dislikeComment(
                        comment._id
                      )
                    }
                  >
                    👎{" "}
                    {comment.dislikes
                      ?.length || 0}
                  </Button>


                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      translateComment(
                        comment._id
                      )
                    }
                  >
                    🌍 Translate
                  </Button>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
};

export default Comments;