import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentItem {
  _id: string;
  commentbody: string;
  usercommented: string;
  userid: string;
  commentedon: string;
  userimage?: string;
}

const Comments = ({ videoId }: { videoId: string }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = { id: "user-123", name: "Sharon", image: "https://github.com/shadcn.png" };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    const added: CommentItem = {
      _id: Math.random().toString(),
      commentbody: newComment.trim(),
      usercommented: user.name,
      userid: user.id,
      commentedon: new Date().toISOString(), // Ensure this is a valid ISO string
      userimage: user.image,
    };

    setComments([added, ...comments]);
    setNewComment("");
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4">{comments.length} Comments</h2>
      
      <form onSubmit={handleSubmitComment} className="flex gap-4 items-start mb-8">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0 px-0"
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => setNewComment("")}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newComment.trim() || isSubmitting}>
              Comment
            </Button>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4 items-start">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.userimage} />
              <AvatarFallback>{comment.usercommented?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{comment.usercommented}</span>
                <span className="text-zinc-500">
                   {/* SAFE DATE RENDERING */}
                   {comment.commentedon ? formatDistanceToNow(new Date(comment.commentedon)) : "Just now"} ago
                </span>
              </div>
              <p className="text-sm mt-1">{comment.commentbody}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;