import Image from "next/image";

import { FetchedPostType, SafeUser } from "@/types";
import { trimString } from "@/lib/utils";

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
    <div className="relative bg-white rounded-xl border-[1px] border-[#d1d1ce] ">
      <img
        src={user?.backgroundImg!}
        alt="user background"
        className="w-full h-20 object-cover rounded-t-xl z-10"
      />

      <Image
        src={user?.avatar!}
        width={80}
        height={80}
        alt="user avatar"
        className="absolute !rounded-full h-20 w-20 ml-4 -mt-10 border-2 border-white z-30 object-cover"
      />

      <div className=" p-4 w-full flex flex-col items-center mt-4">
        <h3 className="text-2xl font-semibold mt-5 self-start">
          {user?.firstname} {user?.lastname}
        </h3>

        {user.bio && (
          <p className=" self-start text-sm my-2 text-gray-900">
            {trimString(user?.bio, 70)}
          </p>
        )}

        <p className="text-gray-500 self-start text-xs">@{user?.username}</p>

        <div className="absolute bottom-22 w-full h-[1px] bg-gray-300" />

        <p className="flex justify-between w-full mt-12 text-gray-500">
          Posts <span className="text-blue-300">{userPostsLength}</span>
        </p>

        <p className="flex justify-between w-full text-gray-500">
          Comments <span className="text-blue-300">{userCommentsLength}</span>
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
