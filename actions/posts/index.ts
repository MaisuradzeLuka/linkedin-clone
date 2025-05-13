"use server";

import { PostType } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const getPosts = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/posts");

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
    const res = await fetch("http://localhost:3000/api/posts", {
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
