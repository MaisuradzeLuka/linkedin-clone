"use client";

import { SignedIn, SignedOut, SignOutButton, useAuth } from "@clerk/nextjs";
import {
  HomeIcon,
  LogOut,
  MessagesSquare,
  User,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchInput from "../Forms/SearchInput";
import { SafeUser } from "@/types";

function Header({ userId, user }: { userId: string | null; user: SafeUser }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between gap-2 py-2 px-3 max-w-6xl mx-auto z-99">
      <Link href="/">
        <Image
          className="hidden md:block rounded-md w-8 md:w-10 h-8 md:h-10"
          src="https://links.papareact.com/b3z"
          width={40}
          height={40}
          alt="logo"
        />

        <Image
          className="md:hidden rounded-full w-8 md:w-10 h-8 md:h-10"
          src={user.avatar || "/assets/default-avatar.jpg"}
          width={40}
          height={40}
          alt="logo"
        />
      </Link>

      <div className=" flex-1">
        <SearchInput />
      </div>

      <div className="flex items-center ">
        <div className="w-full flex justify-center items-center gap-7 border-t-[2px] md:border-none border-[#d1d1ce] bg-white fixed md:relative bottom-0 md:bottom-auto left-0 md:left-auto z-99 py-2 md:py-0 mr-2">
          <Link
            href="/"
            className={`px-2 w-max ${
              pathname === "/"
                ? "iconActive !text-black border-b-[2px] pb-1"
                : "icon"
            }`}
          >
            <HomeIcon className="h-5 " />
            <p>Home</p>
          </Link>

          <Link
            href="/network/following"
            className={`px-2 w-max ${
              pathname.startsWith("/network")
                ? "iconActive !text-black border-b-[2px] pb-1"
                : "icon"
            }`}
          >
            <UsersIcon className="h-5" />
            <p>Network</p>
          </Link>

          <Link
            href={`/user/${userId}`}
            className={`px-2 w-max ${
              pathname.startsWith("/user")
                ? "iconActive !text-black border-b-[2px] pb-1"
                : "icon"
            }`}
          >
            <User className="h-5 " />
            <p>User</p>
          </Link>
        </div>

        <SignedIn>
          <SignOutButton>
            <div className="cursor-pointer">
              <LogOut />
            </div>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">Log in</Link>
        </SignedOut>
      </div>
    </div>
  );
}

export default Header;
