import { User } from "@clerk/nextjs/server";
import Image from "next/image";

import { FetchedPostType, SafeUser } from "@/types";

const UserInfo = async ({
  posts,
  user,
}: {
  posts: FetchedPostType[];
  user: SafeUser;
}) => {
  const userPostsLength =
    posts.filter((post) => post.user.userId === user?.userId).length || 0;

  const userCommentsLength = posts.reduce((count, post) => {
    const comments = post.comments ?? [];
    const userComments = comments.filter(
      (comment) => comment.user.userId === user?.userId
    );
    return count + userComments.length;
  }, 0);

  return (
    <div className="relative bg-white rounded-md p-4 flex flex-col items-center">
      <Image
        src={user?.avatar!}
        width={80}
        height={80}
        alt="user avatar"
        className="!rounded-full h-20 w-20"
      />

      <h3 className="text-lg font-semibold mt-5">
        {user?.firstname} {user?.lastname}
      </h3>
      <p className="text-gray-500">@{user?.username}</p>

      <div className="absolute bottom-22 w-full h-[1px] bg-gray-300" />

      <p className="flex justify-between w-full mt-12 text-gray-500">
        Posts <span className="text-blue-300">{userPostsLength}</span>
      </p>

      <p className="flex justify-between w-full text-gray-500">
        Comments <span className="text-blue-300">{userCommentsLength}</span>
      </p>
    </div>
  );
};

export default UserInfo;
