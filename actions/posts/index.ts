"use server";

import connectToDb from "@/mongodb";
import { Post } from "@/mongodb/schemas/Post";
import { CommentType, FetchedPostType } from "@/types";
import { revalidatePath } from "next/cache";
import { registerModels } from "../models";

registerModels();

export const getPosts = async () => {
  await connectToDb();

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "user",
        },
        {
          path: "comments",
          options: { sort: { createdAt: -1 } },
          populate: { path: "user" },
        },
      ])
      .lean<FetchedPostType[]>();

    return posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      comments: post.comments?.map((comment: CommentType) => ({
        ...comment,
        user: { ...comment.user, _id: comment.user._id.toString() },
        _id: comment._id.toString(),
      })),
    }));
  } catch (error: any) {
    throw new Error(`Failed while getting posts: ${error.message}`);
  }
};

export const deletePost = async (postId: string) => {
  await connectToDb();

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);

    revalidatePath("/");

    if (deletedPost) {
      return "SUCCESS";
    } else {
      return "ERROR";
    }
  } catch (error: any) {
    throw new Error(`Error while deleting post: ${error.message}`);
  }
};

export const createPost = async (
  postValue: string,
  user: string,
  image?: string
) => {
  const postBody = {
    text: postValue,
    user: user,
    postImage: image,
  };
  await connectToDb();

  try {
    const newPost = await Post.create(postBody);

    revalidatePath("/");
    return "SUCCESS";
  } catch (error: any) {
    throw new Error(`Error while creating post: ${error.message}`);
  }
};

export const likeUnlikePost = async (
  postId: string,
  type: "like" | "unlike",
  userId: string
) => {
  await connectToDb();

  try {
    if (type === "like") {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { $addToSet: { likes: userId } },
        { new: true }
      );

      return updatedPost.likes;
    } else if (type === "unlike") {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: userId } },
        { new: true }
      );

      return updatedPost.likes;
    }
  } catch (error: any) {
    throw new Error(`Error while liking/unliking post: ${error.message}`);
  }
};
