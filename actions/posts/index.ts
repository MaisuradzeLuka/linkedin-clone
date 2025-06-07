"use server";

import connectToDb from "@/mongodb";
import { Post } from "@/mongodb/schemas/Post";
import { CommentType, FetchedPostType } from "@/types";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { registerModels } from "../models";
import {
  blobServiceClient,
  containerName,
  generateBlobSASUrl,
  generateWriteSASToken,
} from "@/lib/generateSASToken";

registerModels();

export const getPosts = async (skip = 0) => {
  await connectToDb();

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10)
      .populate([
        { path: "user" },
        {
          path: "comments",
          options: { sort: { createdAt: -1 } },
          populate: { path: "user" },
        },
      ])
      .lean<FetchedPostType[]>();

    const postsWithSignedUrls = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        _id: post._id.toString(),
        postImage: post.postImage
          ? await generateBlobSASUrl(post.postImage)
          : undefined,
        comments: post.comments?.map((comment: CommentType) => ({
          ...comment,
          _id: comment._id.toString(),
          user: { ...comment.user, _id: comment.user._id.toString() },
        })),
      }))
    );

    return postsWithSignedUrls;
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
  image?: File
) => {
  const postBody = {
    text: postValue,
    user: user,
    postImage: "",
  };

  if (image) {
    try {
      const sasToken = await generateWriteSASToken();
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blobName = `${randomUUID()}?${sasToken}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: {
          blobContentType: image.type,
        },
      });

      postBody.postImage = blobName;
    } catch (error: any) {
      throw new Error(`Coulnt upload image to azure: ${error.message}`);
    }
  }

  try {
    await connectToDb();

    await Post.create(postBody);

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
