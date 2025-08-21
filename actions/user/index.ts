"use server";

import imagekit from "@/lib/generateImageKitInstance";
import {
  blobServiceClient,
  generateBlobSASUrl,
  generateWriteSASToken,
} from "@/lib/generateSASToken";
import connectToDb from "@/mongodb";
import { User } from "@/mongodb/schemas/User";
import { Network } from "@/types";
import { randomUUID } from "crypto";

type CreateUserInput = {
  firstname: string;
  lastname: string;
  username: string;
  bio?: string;
  avatar: File | string;
  backgroundImg?: File | string;
  userId: string;
};

type GetUserInput = {
  userId: string;
  followingUserId?: string;
};

type UserType =
  | { create: CreateUserInput; get?: undefined; update?: undefined }
  | { get: GetUserInput; create?: undefined; update?: undefined }
  | { update: CreateUserInput; create?: undefined; get?: undefined };

type FetchedUserType = CreateUserInput & {
  following: string[];
  _id: string;
};

export const createOrGetUser = async ({ create, get, update }: UserType) => {
  await connectToDb();

  try {
    if (get) {
      const existingUser = await User.findOne({ userId: get.userId });

      if (existingUser) {
        const plainObject = {
          avatar: existingUser.avatar.img,
          backgroundImg: existingUser.backgroundImg.img,
          _id: existingUser._id.toString(),
          userId: existingUser.userId,
          bio: existingUser.bio,
          firstname: existingUser.firstname,
          lastname: existingUser.lastname,
          username: existingUser.username,
          following: existingUser.following.map((user: string) =>
            user.toString()
          ),
        };

        return plainObject as FetchedUserType;
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

      const newUser = await User.findOneAndUpdate(
        { userId: create.userId },
        {
          ...create,
          avatar: { img: create.avatar, edited: false },
          backgroundImg: { img: create.backgroundImg, edited: false },
        },
        { upsert: true, new: true }
      );

      return { ...newUser.toObject(), _id: newUser._id.toString() };
    }

    if (update) {
      const updateUser = {
        ...update,
        avatar: { img: update.avatar, edited: false },
        backgroundImg: { img: update.backgroundImg, edited: false },
      };

      if (update.avatar instanceof File) {
        const buffer = Buffer.from(await update.avatar.arrayBuffer());

        const result = await imagekit.upload({
          file: buffer,
          fileName: update.avatar.name,
          folder: "/linkedin-clone/users/avatars",
        });

        updateUser.avatar = { img: result.url, edited: true };
      }

      if (update.backgroundImg instanceof File) {
        const buffer = Buffer.from(await update.backgroundImg.arrayBuffer());

        const result = await imagekit.upload({
          file: buffer,
          fileName: update.backgroundImg.name,
          folder: "/linkedin-clone/users/backgrounds",
        });

        updateUser.backgroundImg = { img: result.url, edited: true };
      }

      const updatedUser = await User.findOneAndUpdate(
        { userId: updateUser.userId },
        { ...updateUser }
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

export const followUser = async (
  followingId: string,
  followerId: string,
  isFollowing: boolean
) => {
  await connectToDb();

  try {
    const followerUpdate = isFollowing
      ? { $pull: { following: followingId } }
      : { $addToSet: { following: followingId } };

    const followingUpdate = isFollowing
      ? { $pull: { followers: followerId } }
      : { $addToSet: { followers: followerId } };

    const updatedFollowerUser = await User.findOneAndUpdate(
      { _id: followerId },
      followerUpdate,
      { new: true }
    ).select("following");

    const updatedFollowingUser = await User.findOneAndUpdate(
      { _id: followingId },
      followingUpdate
    );

    return {
      message: "success",
      following:
        updatedFollowerUser.following.map((user: string) => user.toString()) ||
        [],
    };
  } catch (error: any) {
    throw new Error(
      `Error while ${isFollowing ? "unfollowing" : "following"} user: ${
        error.message
      }`
    );
  }
};

export const getNetwork = async (
  userId: string,
  network: "following" | "followers"
) => {
  await connectToDb();

  try {
    const existingUser: { following: Network[]; followers: Network[] } =
      await User.findOne({
        userId: userId,
      })
        .select(network)
        .populate({
          path: network,
          select: "avatar firstname lastname username bio userId",
        });

    return existingUser;
  } catch (error: any) {
    throw new Error(`Error while fetching network list: ${error.message}`);
  }
};
