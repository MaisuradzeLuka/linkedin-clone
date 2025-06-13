"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NetworkNav = () => {
  const pathname = usePathname();

  return (
    <div className="mt-3 mb-2 mx-5 text-sm">
      <Link
        href="/network/following"
        className={`text-gray-800 mr-6 ${
          pathname?.endsWith("/following")
            ? " border-b-[2px] border-green-800 text-green-800 font-medium pb-2"
            : ""
        }`}
      >
        Following
      </Link>

      <Link
        href="/network/followers"
        className={`text-gray-800  ${
          pathname?.endsWith("/followers")
            ? " border-b-[2px] border-green-800 text-green-800 font-medium pb-2"
            : ""
        }`}
      >
        Followers
      </Link>
    </div>
  );
};

export default NetworkNav;
