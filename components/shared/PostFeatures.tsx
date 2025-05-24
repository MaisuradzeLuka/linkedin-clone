"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { MessageCircle, Repeat, Send, ThumbsUp } from "lucide-react";
import { DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { likeUnlikePost } from "@/actions/posts";
import { CommentType, SafeUser } from "@/types";
import CreateComment from "../Forms/CreateComment";

type PostFeaturesType = {
  postId: string;
  user: SafeUser;
  comments?: CommentType[];
  defaultLikes: string[];
};

const PostFeatures = ({
  user,
  defaultLikes,
  postId,
  comments,
}: PostFeaturesType) => {
  const [isOpen, setIsOpen] = useState(false);
  const [likes, setLikes] = useState<string[]>(defaultLikes);
  const [showForm, setShowForm] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      setFullUrl(`${currentUrl}${postId}`);
    }
  }, [postId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("URL copied", {
        className: " !text-green-500",
        duration: 3000,
      });
      setIsOpen(false);
    } catch (err) {
      toast.error("Couldn't copy URL", {
        className: " !text-red-500",
        duration: 3000,
      });
    }
  };

  const handleLike = async () => {
    const type = likes.includes(user.userId) ? "unlike" : "like";

    const res = await likeUnlikePost(postId, type, user.userId);

    setLikes(res);
  };

  const handleRepost = () => {
    // Handle repost functionality here
  };

  return (
    <div className="w-full flex flex-col items mt-4">
      <div className="w-full sm:w-4/5 self-center flex justify-between items-center">
        <button
          className="flex items-center gap-1 cursor-pointer text-sm md:text-md hover:bg-gray-200 px-2 py-1 rounded-md transition"
          onClick={handleLike}
        >
          <ThumbsUp
            className={`w-4 h-4 sm:w-6 sm:h-6  ${
              likes.includes(user.userId) ? "text-blue-500" : ""
            }`}
          />{" "}
          Like
        </button>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-1 cursor-pointer text-sm hover:bg-gray-200 px-2 py-1 rounded-md transition"
        >
          <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6" /> Comment
        </button>

        <button className="flex items-center gap-1 cursor-pointer text-sm hover:bg-gray-200 px-2 py-1 rounded-md transition">
          <Repeat className="w-4 h-4 sm:w-6 sm:h-6" /> Repost
        </button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="flex items-center gap-1 cursor-pointer text-sm hover:bg-gray-200 px-2 py-1 rounded-md">
            <Send className="w-4 h-4 sm:w-6 sm:h-6" /> Send
          </DialogTrigger>

          <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-md shadow-lg">
            <DialogHeader>
              <DialogTitle className="sr-only">Post share link</DialogTitle>
            </DialogHeader>

            <p className="bg-gray-300 px-3 py-2 rounded-md max-w-[200px] sm:max-w-max overflow-hidden">
              {fullUrl}
            </p>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleCopy}
            >
              Copy
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {showForm && (
        <CreateComment postId={postId} user={user} comments={comments} />
      )}
    </div>
  );
};

export default PostFeatures;
