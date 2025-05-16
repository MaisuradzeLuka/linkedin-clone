"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "../ui/button";
import { createPost } from "@/actions/posts";
import { toast } from "sonner";

const CreatePost = () => {
  const { user } = useUser();

  const [postValue, setPostValue] = useState("");
  const [image, setImage] = useState("");
  const [postValueError, setPostValueError] = useState("");
  const [imageError, setImageError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (file) {
      if (file.size > 500 * 1024) {
        setImageError("Image must be less than 500 kb");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        if (imageError) setImageError("");
      };
      reader.readAsDataURL(file);
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

    if (!user) {
      toast.error("Unauthprised", {
        description: "You must log in to post!",
        className: "!text-red-500",
        duration: 3000,
      });

      return;
    }

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
    const newPost = await createPost(postValue, image);

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
          src={user?.imageUrl || "/assets/default-avatar.jpg"}
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
            variant="secondary"
            className="absolute left-0 bg-black text-white cursor-pointer"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        )}

        <label className="bg-black text-white py-2 px-4 rounded-md font-semibold text-sm  cursor-pointer">
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
            variant="secondary"
            className="bg-black text-white cursor-pointer"
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
