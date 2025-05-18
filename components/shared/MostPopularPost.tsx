import { getTimeAgo } from "@/lib/utils";
import { FetchedPostType } from "@/types";
import Image from "next/image";
import React from "react";

const MostPopularPost = ({ posts }: { posts: FetchedPostType[] }) => {
  const post = posts.reduce((mostLiked, current) => {
    const currentLikes = current.likes?.length || 0;
    const mostLikedCount = mostLiked.likes?.length || 0;
    return currentLikes > mostLikedCount ? current : mostLiked;
  });

  return (
    <article
      key={post._id}
      className="p-4 border-b bg-white rounded-md border-gray-200"
    >
      <div className="flex items-start gap-2">
        <Image
          src={post?.user.avatar}
          width={48}
          height={48}
          alt="user avatar"
          className="rounded-full w-12 h-12"
        />

        <div className="flex flex-col">
          <h3 className="font-semibold">
            {post?.user.firstname} {post?.user.lastname}
          </h3>

          <span className="text-sm text-gray-500">
            @{post?.user.firstname}
            {post?.user.lastname}
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

      <div className="flex justify-between items-center mt-3">
        <p className="text-gray-600 text-sm">
          {post?.likes?.length || 0} Likes{" "}
        </p>
        <p className="text-gray-600 text-sm">
          {post?.comments?.length || 0} Comments{" "}
        </p>
      </div>
    </article>
  );
};

export default MostPopularPost;
