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
    comments: [mongoose.Schema.Types.ObjectId],
  },
  {
    timestamps: true,
  }
);

export const PostSchema =
  mongoose.models.PostSchema || mongoose.model("PostSchema", postSchema);
