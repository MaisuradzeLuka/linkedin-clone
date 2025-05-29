import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postImage: String,
    likes: [String],
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
