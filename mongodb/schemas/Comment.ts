import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      firstname: { type: String, required: true },
      lastname: { type: String },
      avatar: { type: String, required: true },
      userId: { type: String, required: true },
    },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const CommentSchema =
  mongoose.models.CommentSchema ||
  mongoose.model("CommentSchema", commentSchema);
