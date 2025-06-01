"use client";

import { deletePost } from "@/actions/posts";
import { X } from "lucide-react";
import { toast } from "sonner";

const DeletePost = ({ postId }: { postId: string }) => {
  const handleDelete = async () => {
    const deletedPost = await deletePost(postId);

    if (deletedPost === "SUCCESS") {
      toast.success("Post deleted successfuly!", {
        description: "Your comment has been added successfully.",
        className: " !text-green-500",
        duration: 3000,
      });
    } else {
      toast.error("Couldn't delete post", {
        description: "Please try again later.",
        className: " !text-red-500",
        duration: 3000,
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="sm:hidden group-hover:block absolute right-5 cursor-pointer hover:text-red-500 transition"
    >
      <X className="w-4 h-4 " />
    </button>
  );
};

export default DeletePost;
