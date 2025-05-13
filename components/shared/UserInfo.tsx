import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const UserInfo = async () => {
  const user = await currentUser();

  return (
    <div className="relative bg-white rounded-md p-4">
      <SignedIn>
        <div className="flex flex-col items-center">
          <Image
            src={user?.imageUrl!}
            width={80}
            height={80}
            alt="user avatar"
            className="!rounded-full h-20 w-20"
          />

          <h3 className="text-lg font-semibold mt-5">{user?.fullName}</h3>
          <p className="text-gray-500">@{user?.fullName}</p>

          <div className="absolute bottom-22 w-full h-[1px] bg-gray-300" />

          <p className="flex justify-between w-full mt-12 text-gray-500">
            Posts <span className="text-blue-300">0</span>
          </p>

          <p className="flex justify-between w-full text-gray-500">
            Comments <span className="text-blue-300">0</span>
          </p>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/assets/default-avatar.jpg"
            width={40}
            height={40}
            alt="user avatar"
            className="w-12 h-12"
          />

          <Button
            asChild
            className="text-lg bg-blue-500 text-white"
            variant="secondary"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </SignedOut>
    </div>
  );
};

export default UserInfo;
