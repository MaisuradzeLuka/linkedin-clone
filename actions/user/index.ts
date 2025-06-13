"use server";

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

export async function generateImgUrl(
  image: { img: string; edited: boolean },
  container: string
) {
  if (image.edited) return await generateBlobSASUrl(image.img, container);
  if (!image.edited) return image.img;
}

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

        if (existingUser.avatar.edited) {
          plainObject.avatar = await generateBlobSASUrl(
            existingUser.avatar.img,
            "users"
          );
        }

        if (existingUser.backgroundImg.edited) {
          plainObject.backgroundImg = await generateBlobSASUrl(
            existingUser.backgroundImg.img,
            "users"
          );
        }

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
        const sasToken = await generateWriteSASToken("users");
        const containerClient = blobServiceClient.getContainerClient("users");
        const avatarName = `${randomUUID()}?${sasToken}`;
        const blockBlobClient = containerClient.getBlockBlobClient(avatarName);

        const arrayBuffer = await update.avatar.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await blockBlobClient.uploadData(buffer, {
          blobHTTPHeaders: {
            blobContentType: update.avatar.type,
          },
        });

        updateUser.avatar = { img: avatarName, edited: true };
      }

      if (update.backgroundImg instanceof File) {
        const sasToken = await generateWriteSASToken("users");
        const containerClient = blobServiceClient.getContainerClient("users");
        const backgroundImgName = `${randomUUID()}?${sasToken}`;
        const blockBlobClient =
          containerClient.getBlockBlobClient(backgroundImgName);

        const arrayBuffer = await update.backgroundImg.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await blockBlobClient.uploadData(buffer, {
          blobHTTPHeaders: {
            blobContentType: update.backgroundImg.type,
          },
        });

        updateUser.backgroundImg = { img: backgroundImgName, edited: true };
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

    if (existingUser.following?.length) {
      existingUser.following.map(async (user) => {
        if (user.avatar.edited) {
          user.avatar.img = (await generateBlobSASUrl(
            user.avatar.img,
            "users"
          )) as string;
        }
      });
    }

    if (existingUser.followers?.length) {
      existingUser.followers.map(async (user) => {
        if (user.avatar.edited) {
          user.avatar.img = (await generateBlobSASUrl(
            user.avatar.img,
            "users"
          )) as string;
        }
      });
    }

    return existingUser;
  } catch (error: any) {
    throw new Error(`Error while fetching network list: ${error.message}`);
  }
};
