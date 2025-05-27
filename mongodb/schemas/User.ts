import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: String,
  //   followers: {type: [mongoose.Schema.Types.ObjectId], default: [] },
  //     following:{type: [mongoose.Schema.Types.ObjectId], default: [] },
  avatar: { type: String, required: true },
  backgroundImg: String,
  bio: String,
  username: { type: String, required: true },
  userId: { type: String, required: true },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
