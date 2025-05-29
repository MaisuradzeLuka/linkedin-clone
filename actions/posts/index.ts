"use server";

import connectToDb from "@/mongodb";
import { Post } from "@/mongodb/schemas/Post";
import { FetchedPostType } from "@/types";
import { revalidatePath } from "next/cache";

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
      user: {
        ...post.user,
        _id: post.user._id.toString(),
      },
      comments: post.comments?.map((comment: any) => ({
        ...comment,
        _id: comment._id.toString(),
        user: {
          ...comment.user,
          _id: comment.user._id.toString(),
        },
      })),
    }));
  } catch (error: any) {
    throw new Error(`Failed while getting posts: ${error.message}`);
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

  try {
    await connectToDb();

    const newPost = await Post.create(postBody);

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

    revalidatePath("/");
  } catch (error: any) {
    throw new Error(`Error while liking/unliking post: ${error.message}`);
  }
};
