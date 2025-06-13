"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LoadMorePosts = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
        setIsLoading(true);

        const searchParams = new URLSearchParams(window.location.search);

        const skipValue = searchParams.get("skip") || 0;

        const updatedSkipValue = +skipValue + 10;

        searchParams.delete("skip");

        searchParams.set("skip", updatedSkipValue.toString());

        const newPath = `${
          window.location.pathname
        }?${searchParams.toString()}`;

        router.push(newPath, { scroll: false });

        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, pathname, router, searchParams]);

  return null; // This component does not render anything
};

export default LoadMorePosts;
