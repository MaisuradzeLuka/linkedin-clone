"use server";

import connectToDb from "@/mongodb";
import { Post } from "@/mongodb/schemas/Post";
import { CommentType, FetchedPostType } from "@/types";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { registerModels } from "../models";
import {
  blobServiceClient,
  generateBlobSASUrl,
  generateWriteSASToken,
} from "@/lib/generateSASToken";
import { generateImgUrl } from "../user";

registerModels();

export const getPosts = async (search = "", skip = 0, userId?: string) => {
  await connectToDb();

  const query: any = {};

  if (search.trim()) {
    query.text = { $regex: search, $options: "i" };
  }

  try {
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate([
        { path: "user" },
        {
          path: "comments",
          options: { sort: { createdAt: -1 } },
          populate: {
            path: "user",
            select: "userId avatar firstname lastname",
          },
        },
      ])
      .lean<FetchedPostType[]>();

    const postsWithSignedUrls = await Promise.all(
      posts.map(async (post) => {
        const signedPostImage = post.postImage
          ? await generateBlobSASUrl(post.postImage, "posts")
          : undefined;

        const userAvatar = await generateImgUrl(
          post.user.avatar as unknown as { img: string; edited: boolean },
          "users"
        );

        const commentsWithAvatars = await Promise.all(
          (post.comments ?? []).map(async (comment: CommentType) => ({
            ...comment,
            _id: comment._id.toString(),
            user: {
              ...comment.user,
              _id: comment.user._id.toString(),
              avatar: await generateImgUrl(
                comment.user.avatar as unknown as {
                  img: string;
                  edited: boolean;
                },
                "users"
              ),
            },
          }))
        );

        return {
          ...post,
          _id: post._id.toString(),
          user: {
            _id: post.user._id.toString(),
            userId: post.user.userId,
            bio: post.user.bio,
            firstname: post.user.firstname,
            lastname: post.user.lastname,
            username: post.user.username,
            avatar: userAvatar,
          },
          postImage: signedPostImage,
          comments: commentsWithAvatars,
        };
      })
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

    const imageUrl = await generateBlobSASUrl(deletedPost.postImage, "posts");

    const res = await fetch(imageUrl as URL | RequestInfo, {
      method: "DELETE",
    });

    revalidatePath("/");

    if (deletedPost && res.ok) {
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
      const sasToken = await generateWriteSASToken("posts");
      const containerClient = blobServiceClient.getContainerClient("posts");
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
