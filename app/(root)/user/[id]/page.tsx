import { getPosts } from "@/actions/posts";
import { createOrGetUser } from "@/actions/user";
import FollowUser from "@/components/shared/FollowUser";
import PostFeed from "@/components/shared/PostFeed";
import { FetchedPostType, SafeUser } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search: string }>;
}) => {
  const user = await auth();
  const { id } = await params;
  const { search } = await searchParams;

  const existingUser: SafeUser = await createOrGetUser({
    get: { userId: id },
  });

  const posts: FetchedPostType[] = await getPosts(search, 0, id);

  const filteredPosts = posts.filter(
    (post) => post.user.userId === existingUser.userId
  );

  const isAuthenticated = id === user.userId;

  return (
    <div className="flex flex-col items-center mt-10">
      <section className="w-full md:w-max">
        <img
          src={existingUser.backgroundImg}
          alt="user background"
          className="w-full md:w-[700px] rounded-4xl object-cover h-[230px]"
        />

        <div className="w-[95%] mx-auto flex items-end justify-between">
          <Image
            src={existingUser.avatar || "/assets/default-avatar.jpg"}
            width={95}
            height={95}
            alt="user profile"
            className="w-22 h-22 md:w-25 md:h-25 rounded-full p-[2px] bg-gray-400 -mt-12"
          />

          {isAuthenticated && (
            <Link
              href={`/user/${id}/edit`}
              className="px-3 py-[6px] text-sm md:text-md font-medium rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
            >
              Edit
            </Link>
          )}

          {!isAuthenticated && (
            <FollowUser
              followerId={user.userId}
              followingId={existingUser._id}
            />
          )}
        </div>

        <div className="flex flex-col mt-8">
          <h2 className="text-xl font-semibold">
            {existingUser.firstname} {existingUser.lastname}
          </h2>

          <p className="text-gray-600">@{existingUser.username}</p>

          {existingUser.bio && (
            <p className="max-w-[700px] text-gray-500 mt-2 text-sm lg:text-md">
              {existingUser.bio}
            </p>
          )}
        </div>
      </section>

      <section className="w-full md:w-[700px] mt-8">
        <PostFeed
          showCreatePost={isAuthenticated}
          posts={filteredPosts}
          user={existingUser}
          isAuthenticated={isAuthenticated}
        />
      </section>
    </div>
  );
};

export default page;
