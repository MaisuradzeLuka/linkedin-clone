import { getNetwork } from "@/actions/user";
import { Network } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const { userId } = await auth();

  const { following }: { following: Network[] } = await getNetwork(
    userId!,
    "following"
  );

  return (
    <div className=" flex flex-col">
      {following.length ? (
        following.map((user, index) => (
          <div className="flex gap-4" key={user._id}>
            <Link href={`/user/${user.userId}`}>
              <Image
                src={user.avatar?.img || "/assets/defaut-avatar.jpg"}
                height={48}
                width={48}
                alt="following user profile"
                className="rounded-full w-12 h-12 object-cover"
              />
            </Link>

            <div className="w-full">
              <div>
                <h2 className="font-semibold text-[16px]">
                  {user.firstname} {user.lastname}
                </h2>

                <p className="text-gray-700">
                  {user.bio ? user.bio : `@${user.username}`}
                </p>
              </div>

              {following.length - 1 !== index && (
                <div className="w-full h-[1px] bg-gray-300 mt-4" />
              )}
            </div>
          </div>
        ))
      ) : (
        <h1>You are not following anyone</h1>
      )}
    </div>
  );
};

export default page;
