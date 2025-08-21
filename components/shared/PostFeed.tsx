import CreatePost from "../Forms/CreatePost";
import { FetchedPostType, SafeUser } from "@/types";
import { getTimeAgo } from "@/lib/utils";
import PostFeatures from "./PostFeatures";
import Link from "next/link";
import DeletePost from "./DeletePost";
import LoadMorePosts from "./LoadMorePosts";
import { Image, ImageKitAbortError } from "@imagekit/next";

const PostFeed = async ({
  posts,
  user,
  showCreatePost = true,
  isAuthenticated,
}: {
  posts: FetchedPostType[];
  user: SafeUser;
  showCreatePost?: boolean;
  isAuthenticated?: boolean;
}) => {
  const clientUser = {
    firstname: user.firstname ?? "",
    lastname: user.lastname ?? "",
    avatar: user.avatar,
    userId: user.userId,
    _id: user._id,
  };

  return (
    <div className="flex flex-col gap-2 mb-20 md:mb-0">
      {showCreatePost && <CreatePost user={clientUser as SafeUser} />}

      <div className="w-full h-[1px] bg-gray-300 mt-2" />

      <section className="flex flex-col gap-4 py-2 ">
        {posts.length ? (
          posts?.map((post) => (
            <article
              key={post._id}
              className="relative p-4 border-b bg-white rounded-xl group border-[1px] border-[#d1d1ce]"
            >
              {isAuthenticated && <DeletePost postId={post._id} />}

              <div className="flex items-start gap-2">
                <Link href={`/user/${post.user.userId}`}>
                  <Image
                    src={post?.user.avatar!.img}
                    width={48}
                    height={48}
                    alt="user avatar"
                    className="rounded-full w-12 h-12"
                  />
                </Link>

                <div className="flex flex-col">
                  <h3 className="font-semibold">
                    {post?.user.firstname} {post?.user.lastname}
                  </h3>

                  <span className="text-sm text-gray-500">
                    @{post?.user.username}
                  </span>

                  <span className="text-gray-500 text-sm">
                    {getTimeAgo(post?.createdAt)}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mt-2">{post?.text}</p>

              {post?.postImage && (
                <img
                  src={post?.postImage?.toString()}
                  alt="post image"
                  className="rounded-md object-cover my-2"
                />
              )}

              <PostFeatures
                postId={post._id}
                comments={post.comments}
                user={clientUser}
                defaultLikes={post.likes || []}
              />
            </article>
          ))
        ) : (
          <p className="mx-auto mt-8 text-lg font-medium">
            There are no posts to display
          </p>
        )}
      </section>
    </div>
  );
};

export default PostFeed;
