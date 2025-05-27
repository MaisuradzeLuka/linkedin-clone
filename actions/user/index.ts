"use server";

import connectToDb from "@/mongodb";
import { User } from "@/mongodb/schemas/User";

type CreateUserInput = {
  firstname: string;
  lastname: string;
  username: string;
  bio?: string;
  avatar: string;
  backgroundImg?: string;
  userId: string;
};

type GetUserInput = {
  userId: string;
};

type UserType =
  | { create: CreateUserInput; get?: undefined; update?: undefined }
  | { get: GetUserInput; create?: undefined; update?: undefined }
  | { update: CreateUserInput; create?: undefined; get?: undefined };

export const createOrGetUser = async ({ create, get, update }: UserType) => {
  await connectToDb();

  try {
    if (get) {
      const existingUser = await User.findOne({ userId: get.userId });
      if (existingUser) {
        return { ...existingUser.toObject(), _id: existingUser._id.toString() };
      } else {
        return { message: "User not found" };
      }
    }

    if (create) {
      const existingUsername = await User.findOne({
        username: create.username,
      });
      if (existingUsername) {
        return { message: "Username already exists" };
      }

      const newUser = await User.create(create);
      return { ...newUser.toObject(), _id: newUser._id.toString() };
    }

    if (update) {
      const updatedUser = await User.findOneAndUpdate(
        { userId: update.userId },
        { ...update }
      );

      if (updatedUser) {
        return { status: "SUCCESS" };
      } else {
        return { message: "User not found" };
      }
    }

    return { message: "Invalid input" };
  } catch (error: any) {
    throw new Error(`Error while processing user: ${error.message}`);
  }
};
