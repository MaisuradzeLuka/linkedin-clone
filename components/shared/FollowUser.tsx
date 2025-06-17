"use client";

import { createOrGetUser, followUser } from "@/actions/user";
import { SafeUser } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FollowUser = ({
  followingId,
  followerId,
}: {
  followingId: string;
  followerId: string | null;
}) => {
  const [followerUser, setFollowerUser] = useState<SafeUser | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!followingId) return;
    const getUser = async () => {
      const existingUser = await createOrGetUser({
        get: { userId: followerId || "" },
      });

      if (existingUser.following.includes(followingId)) {
        setIsFollowing(true);
      }

      setFollowerUser(existingUser);
    };

    getUser();
  }, []);

  const handleUserFollow = async () => {
    if (!followerUser?._id || !followingId) return;

    const res = await followUser(followingId, followerUser?._id, isFollowing);

    if (res.message !== "success") {
      toast.error("Something went wrong, please try again.");
      return;
    }

    setIsFollowing(res.following.includes(followingId));
  };

  return (
    <button
      onClick={handleUserFollow}
      className="flex items-center gap-2 px-[14px] py-[4px] text-sm md:text-md font-medium rounded-full border border-gray-700 text-gray-700 hover:outline transition cursor-pointer"
    >
      {isFollowing ? (
        <span className="text-[16px]">Unfollow</span>
      ) : (
        <>
          <Plus /> <span className="text-[16px]">Follow</span>
        </>
      )}
    </button>
  );
};

export default FollowUser;
