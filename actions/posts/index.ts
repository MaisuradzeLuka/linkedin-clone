"use server";

import { PostType } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const isProduction = false;

const API_URL = isProduction
  ? process.env.NEXT_PUBLIC_API_URL
  : "http://localhost:3000/api/posts/";

export const getPosts = async () => {
  console.log(process.env.NEXT_PUBLIC_API_URL);
  try {
    const res = await fetch(`${API_URL}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch posts`);
    }

    return res.json();
  } catch (error: any) {
    throw new Error(`Failed while fethving posts: ${error.message}`);
  }
};

export const createPost = async (postValue: string, image?: string) => {
  const user = await currentUser();

  if (!user) return "User not found";

  const postBody: PostType = {
    text: postValue,
    user: {
      firstname: user.firstName ?? "",
      lastname: user.lastName ?? "",
      avatar: user.imageUrl,
      userId: user.id,
    },
    postImage: image,
  };

  try {
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postBody),
    });

    if (!res.ok) {
      throw new Error(`Failed to create post`);
    }

    revalidatePath("/");
    return await res.json();
  } catch (error: any) {
    throw new Error(`Error while creating post: ${error.message}`);
  }
};

export const likeUnlikePost = async (postId: string, additionalUrl: string) => {
  const user = await currentUser();

  if (!user) return "User not found";

  const body = {
    user: user.id,
    postId,
  };

  try {
    const res = await fetch(`${API_URL}${postId}/${additionalUrl}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to like/unlike post`);
    }

    return res.json();
  } catch (error: any) {
    throw new Error(`Error while liking/unliking post: ${error.message}`);
  }
};
