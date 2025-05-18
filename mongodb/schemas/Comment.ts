import mongoose from "mongoose";

const comment = new mongoose.Schema(
  {
    user: {
      firstname: { type: String, required: true },
      lastname: { type: String },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      avatar: { type: String, required: true },
    },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const CommentSchema =
  mongoose.models.CommmentSchema || mongoose.model("CommentSchema", comment);
