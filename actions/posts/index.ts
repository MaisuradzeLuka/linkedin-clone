"use server";

import connectToDb from "@/mongodb";
import { PostSchema } from "@/mongodb/schemas/Post";
import { FetchedPostType, PostType } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const getPosts = async () => {
  try {
    await connectToDb();

    const posts = await PostSchema.find()
      .sort({ createdAt: -1 })
      .lean<FetchedPostType[]>();

    return posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
    }));
  } catch (error: any) {
    throw new Error(`Failed while getting posts: ${error.message}`);
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
    await connectToDb();

    const newPost = await PostSchema.create(postBody);

    const plainPost = {
      ...newPost.toObject(),
      _id: newPost._id.toString(),
      createdAt: newPost.createdAt?.toString(),
    };

    revalidatePath("/");
    return plainPost;
  } catch (error: any) {
    throw new Error(`Error while creating post: ${error.message}`);
  }
};

export const likeUnlikePost = async (
  postId: string,
  type: "like" | "unlike"
) => {
  const user = await currentUser();

  if (!user) return "User not found";

  try {
    await connectToDb();

    if (type === "like") {
      const updatedPost = await PostSchema.findOneAndUpdate(
        { _id: postId },
        { $addToSet: { likes: user.id } },
        { new: true }
      );

      return updatedPost.likes;
    } else if (type === "unlike") {
      const updatedPost = await PostSchema.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: user.id } },
        { new: true }
      );

      return updatedPost.likes;
    }
  } catch (error: any) {
    throw new Error(`Error while liking/unliking post: ${error.message}`);
  }
};
