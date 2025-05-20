import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: {
      firstname: { type: String, required: true },
      lastname: { type: String },
      avatar: { type: String, required: true },
      userId: { type: String, required: true },
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
