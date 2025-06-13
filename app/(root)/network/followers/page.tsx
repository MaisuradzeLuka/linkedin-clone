import { getNetwork } from "@/actions/user";
import { Network } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const { userId } = await auth();

  const { followers }: { followers: Network[] } = await getNetwork(
    userId!,
    "followers"
  );

  return (
    <div className="flex flex-col">
      {followers.length ? (
        followers.map((user, index) => (
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

              {followers.length - 1 !== index && (
                <div className="w-full h-[1px] bg-gray-300 mt-4" />
              )}
            </div>
          </div>
        ))
      ) : (
        <h1>You have no followers</h1>
      )}
    </div>
  );
};

export default page;
