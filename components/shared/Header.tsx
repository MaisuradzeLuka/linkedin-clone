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

function Header() {
  const { userId } = useAuth();

  return (
    <div className="flex items-center justify-between p-2 max-w-6xl mx-auto">
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

      <div className="flex items-center space-x-4 px-6">
        <Link href="/" className="icon">
          <HomeIcon className="h-5 " />
          <p>Home</p>
        </Link>

        <Link href="" className="icon hidden md:flex">
          <UsersIcon className="h-5" />
          <p>Network</p>
        </Link>

        <Link href={`/user/${userId}`} className="icon hidden md:flex">
          <User className="h-5" />
          <p>User</p>
        </Link>

        <Link href="" className="icon">
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
