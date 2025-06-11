import { getPosts } from "@/actions/posts";
import { createOrGetUser } from "@/actions/user";
import MostPopularPost from "@/components/shared/MostPopularPost";
import PostFeed from "@/components/shared/PostFeed";
import UserInfo from "@/components/shared/UserInfo";
import Post from "@/components/Skeletons/Post";
import { FetchedPostType } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) => {
  const { search } = await searchParams;

  const user = await auth();

  const existingUser = await createOrGetUser({
    get: { userId: user.userId || "" },
  });

  const posts: FetchedPostType[] = await getPosts(search);

  return (
    <div className="grid grid-cols-8 gap-2 mt-6">
      <section className="hidden md:inline col-span-2">
        <UserInfo posts={posts} user={existingUser} />
      </section>

      <section className="col-span-8 md:col-span-6 lg:col-span-4">
        <Suspense
          fallback={[1, 2].map((skeleton) => (
            <Post key={skeleton} />
          ))}
        >
          <PostFeed posts={posts} user={existingUser} />
        </Suspense>
      </section>

      {posts.length ? (
        <section className="hidden lg:inline col-span-2">
          <MostPopularPost posts={posts} />
        </section>
      ) : (
        ""
      )}
    </div>
  );
};

export default page;
