import { User } from "@/mongodb/schemas/User";
import { Post } from "@/mongodb/schemas/Post";
import { Comment } from "@/mongodb/schemas/Comment";

export function registerModels() {
  User;
  Post;
  Comment;
}
