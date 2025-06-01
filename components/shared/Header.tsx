"use client";

import { SignedIn, SignedOut, SignOutButton, useAuth } from "@clerk/nextjs";
import {
  Briefcase,
  HomeIcon,
  MessagesSquare,
  SearchIcon,
  User,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Header() {
  const { userId } = useAuth();

  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between p-2 max-w-6xl mx-auto z-99">
      <Link href="/">
        <Image
          className="rounded-lg"
          src="https://links.papareact.com/b3z"
          width={40}
          height={40}
          alt="logo"
        />
      </Link>

      <div className="hidden sm:inline flex-1">
        <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
          <SearchIcon className="h-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-1 outline-none"
          />
        </form>
      </div>

      <div className="flex items-center px-6">
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

        <Link href="" className="icon px-2 w-max hidden md:flex">
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

        <Link href="" className="icon icon px-2 w-max hidden md:flex">
          <MessagesSquare className="h-5" />
          <p>Messaging</p>
        </Link>

        <SignedIn>
          <SignOutButton>
            <div className="cursor-pointer">Log out</div>
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
