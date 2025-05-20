"use server";

import connectToDb from "@/mongodb";
import { Comment } from "@/mongodb/schemas/Comment";
import { PostSchema } from "@/mongodb/schemas/Post";

import { revalidatePath } from "next/cache";

export const createComment = async (commentBody: any, postId: string) => {
  await connectToDb();

  try {
    const newComment = await Comment.create(commentBody);

    await PostSchema.findByIdAndUpdate(
      { _id: postId },
      {
        $push: { comments: newComment._id },
      }
    );

    const plainComment = {
      ...newComment.toObject(),
      _id: newComment._id.toString(),
      createdAt: newComment.createdAt?.toString(),
    };

    revalidatePath("/");
    return plainComment;
  } catch (error: any) {
    throw new Error(`Error while creating comment: ${error.message}`);
  }
};
