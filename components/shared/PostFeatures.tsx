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
import { useUser } from "@clerk/nextjs";
import { likeUnlikePost } from "@/actions/posts";

const PostFeatures = ({ postId }: { postId: string }) => {
  const user = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likes, setLikes] = useState<string[]>([]);

  const validateUser = () => {
    if (!user.isSignedIn) {
      toast.error("You need to be signed in!", {
        className: " !text-red-500",
        duration: 3000,
      });
      return;
    }
  };

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
    validateUser();

    setIsLoading(true);
    const url = user.user && likes.includes(user.user.id) ? "unlike" : "like";

    const res = await likeUnlikePost(postId, url);

    setLikes(res);
    setIsLoading(false);
  };

  const handleComment = () => {
    validateUser();
    // Handle comment functionality here
  };

  const handleRepost = () => {
    validateUser();
    // Handle repost functionality here
  };

  return (
    <div className="w-full sm:w-4/5 mx-auto flex justify-between items-center mt-4">
      <button
        className="flex items-center gap-1 cursor-pointer text-sm md:text-md"
        onClick={handleLike}
      >
        <ThumbsUp
          className={`w-4 h-4 sm:w-6 sm:h-6  ${
            user.user && likes.includes(user.user.id) ? "text-blue-500" : ""
          }`}
        />{" "}
        Like
      </button>

      <button className="flex items-center gap-1 cursor-pointer text-sm">
        <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6" /> Comment
      </button>

      <button className="flex items-center gap-1 cursor-pointer text-sm">
        <Repeat className="w-4 h-4 sm:w-6 sm:h-6" /> Repost
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="flex items-center gap-1 cursor-pointer text-sm">
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
    </div>
  );
};

export default PostFeatures;
