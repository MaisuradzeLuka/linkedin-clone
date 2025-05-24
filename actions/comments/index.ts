"use server";

import connectToDb from "@/mongodb";
import { Comment } from "@/mongodb/schemas/Comment";
import { Post } from "@/mongodb/schemas/Post";

import { revalidatePath } from "next/cache";

export const createComment = async (commentBody: any, postId: string) => {
  await connectToDb();

  try {
    const comment = new Comment(commentBody);

    await comment.save();
    await comment.populate({
      path: "user",
      select: "username avatar",
    });

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    const plainComment = {
      ...comment.toObject(),
      _id: comment._id.toString(),
      createdAt: comment.createdAt?.toString(),
      user: {
        ...comment.user.toObject(),
        _id: comment.user._id.toString(),
      },
    };

    revalidatePath("/");
    return plainComment;
  } catch (error: any) {
    throw new Error(`Error while creating comment: ${error.message}`);
  }
};
