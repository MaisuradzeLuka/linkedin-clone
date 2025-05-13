"use client";

import { MessageCircle, Repeat, Send, ThumbsUp } from "lucide-react";

const PostFeatures = () => {
  return (
    <div className="w-full sm:w-4/5 mx-auto flex justify-between items-center mt-4">
      <button className="flex items-center gap-1 cursor-pointer text-sm md:text-md">
        <ThumbsUp className="w-4 h-4 sm:w-6 sm:h-6" /> Like
      </button>

      <button className="flex items-center gap-1 cursor-pointer text-sm">
        <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6" /> Comment
      </button>

      <button className="flex items-center gap-1 cursor-pointer text-sm">
        <Repeat className="w-4 h-4 sm:w-6 sm:h-6" /> Repost
      </button>

      <button className="flex items-center gap-1 cursor-pointer text-sm">
        <Send className="w-4 h-4 sm:w-6 sm:h-6" /> Send
      </button>
    </div>
  );
};

export default PostFeatures;
