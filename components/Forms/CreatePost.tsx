"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { createPost } from "@/actions/posts";
import { toast } from "sonner";
import { SafeUser } from "@/types";
import { imageToBase64 } from "@/lib/utils";

const CreatePost = ({ user }: { user: SafeUser }) => {
  const [postValue, setPostValue] = useState("");
  const [image, setImage] = useState("");
  const [postValueError, setPostValueError] = useState("");
  const [imageError, setImageError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    const image = await imageToBase64(file);

    if (image.status === "ERROR") {
      setImageError(image.body);
      return;
    } else {
      setImage(image.body);
      if (imageError) setImageError("");
    }
  };

  const onImageDelete = () => {
    setImage("");

    if (imageError) {
      setImageError("");
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const postValueLength = postValue.trim().length;

    if (postValueLength < 2) {
      setPostValueError("Post must be at least 2 characters long");
      return;
    } else if (postValueLength > 1500) {
      setPostValueError("Post must less than 1500 characters long");
      return;
    }

    if (imageError || postValueError) return;

    setIsLoading(true);
    const newPost = await createPost(postValue, user._id, image);

    if (newPost) {
      toast.success("Post created!", {
        description: "Your post has been shared successfully.",
        className: " !text-green-500",
        duration: 3000,
      });

      setPostValue("");
      setImage("");
      setPostValueError("");
      setImageError("");
    } else {
      toast.error("Post failed!", {
        description: "Something went wrong while creating your post.",
        className: "!text-red-500",
        duration: 3000,
      });
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={(e) => onSubmit(e)}
      className="bg-white rounded-md px-6 py-4"
    >
      <div className="flex items-center gap-4">
        <Image
          src={user.avatar || "/assets/default-avatar.jpg"}
          width={40}
          height={40}
          alt="user avatar"
          className="!rounded-full h-10 w-10"
        />

        <div className="relative flex-1">
          <input
            type="text"
            name="post"
            id="post"
            className="outline-none border rounded-full border-gray-400 text-gray-700 px-4 w-full h-10"
            placeholder="Start writing a post..."
            value={postValue}
            onChange={(e) => setPostValue(e.currentTarget.value)}
          />

          {postValueError && (
            <p className="absolute text-red-500 text-sm">{postValueError}</p>
          )}
        </div>
      </div>

      {image && (
        <img
          src={image}
          alt="prewiev"
          className="w-full aspect-video object-cover mt-6 mb-2"
        />
      )}

      {imageError && (
        <p className="block text-red-500 text-center my-8">{imageError}</p>
      )}

      <div className="relative flex justify-end gap-2 mt-6">
        {(image || postValue) && (
          <Button
            variant="outline"
            className="absolute left-0 bg-white text-gray-900 hover:bg-gray-500 hover:text-white transition !border-gray-500 cursor-pointer text-xs sm:text-sm px-2 "
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        )}

        <label className="flex items-center justify-center bg-white text-gray-900 hover:bg-gray-500 hover:text-white transition border !border-gray-500 py-1 px-2 sm:py-2 sm:px-4 rounded-md font-semibold text-xs sm:text-sm  cursor-pointer">
          {image ? "Change image" : "Add image"}
          <input
            type="file"
            accept="image/*"
            name="image"
            id="image"
            onChange={(e) => onImageChange(e)}
            hidden
          />
        </label>

        {image && (
          <Button
            variant="outline"
            className="bg-white text-gray-900 hover:bg-gray-500 hover:text-white transition !border-gray-500 cursor-pointer text-xs sm:text-sm py-1 px-2"
            type="button"
            onClick={onImageDelete}
          >
            Delete image
          </Button>
        )}
      </div>
    </form>
  );
};

export default CreatePost;
