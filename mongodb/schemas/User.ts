import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },

    avatar: {
      img: { type: String, required: true },
      edited: { type: Boolean, default: false },
    },

    backgroundImg: {
      img: { type: String, required: true },
      edited: { type: Boolean, default: false },
    },

    bio: { type: String, default: "" },

    username: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
