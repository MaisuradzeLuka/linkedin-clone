import { getPosts } from "@/actions/posts";
import MostPopularPost from "@/components/shared/MostPopularPost";
import PostFeed from "@/components/shared/PostFeed";
import UserInfo from "@/components/shared/UserInfo";
import { FetchedPostType } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const user = await currentUser();
  const posts: FetchedPostType[] = await getPosts();

  return (
    <div className="grid grid-cols-8 gap-2 mt-6">
      <section className="hidden md:inline col-span-2">
        <UserInfo posts={posts} user={user} />
      </section>

      <section className="col-span-8 md:col-span-6 lg:col-span-4">
        <PostFeed posts={posts} user={user} />
      </section>

      <section className="hidden lg:inline col-span-2">
        <MostPopularPost posts={posts} />
      </section>
    </div>
  );
};

export default page;
