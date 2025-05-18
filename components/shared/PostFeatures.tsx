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
import { useState } from "react";

import { likeUnlikePost } from "@/actions/posts";

const PostFeatures = ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);

  // const url = window.location.href;

  // const fullUrl = `${url}${postId}`;

  // const handleCopy = async () => {
  //   try {
  //     await navigator.clipboard.writeText(fullUrl);
  //     toast.success("Url copied", {
  //       className: " !text-green-500",
  //       duration: 3000,
  //     });

  //     setIsOpen(false);
  //   } catch (err) {
  //     toast.error("Coudln't copy url", {
  //       className: " !text-red-500",
  //       duration: 3000,
  //     });
  //   }
  // };

  const handleLike = async () => {
    setIsLoading(true);
    const type = likes.includes(userId) ? "unlike" : "like";

    const res = await likeUnlikePost(postId, type, userId);

    setLikes(res);
    setIsLoading(false);
  };

  const handleComment = () => {
    // Handle comment functionality here
  };

  const handleRepost = () => {
    // Handle repost functionality here
  };

  return (
    <div className="w-full sm:w-4/5 mx-auto flex justify-between items-center mt-4">
      <button
        className="flex items-center gap-1 cursor-pointer text-sm md:text-md hover:bg-gray-200 px-2 py-1 rounded-md transition"
        onClick={handleLike}
      >
        <ThumbsUp
          className={`w-4 h-4 sm:w-6 sm:h-6  ${
            likes.includes(userId) ? "text-blue-500" : ""
          }`}
        />{" "}
        Like
      </button>

      <button className="flex items-center gap-1 cursor-pointer text-sm hover:bg-gray-200 px-2 py-1 rounded-md transition">
        <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6" /> Comment
      </button>

      <button className="flex items-center gap-1 cursor-pointer text-sm hover:bg-gray-200 px-2 py-1 rounded-md transition">
        <Repeat className="w-4 h-4 sm:w-6 sm:h-6" /> Repost
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="flex items-center gap-1 cursor-pointer text-sm hover:bg-gray-200 px-2 py-1 rounded-md">
          <Send className="w-4 h-4 sm:w-6 sm:h-6" /> Send
        </DialogTrigger>

        {/* <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-md shadow-lg">
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
        </DialogContent> */}
      </Dialog>

      {/* {showForm && <form></form>} */}
    </div>
  );
};

export default PostFeatures;
