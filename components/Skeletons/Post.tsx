import React from "react";
import { Skeleton } from "../ui/skeleton";

const Post = () => {
  return (
    <div className="p-4 border-b bg-white rounded-xl border-gray-200 mb-6">
      <div className="flex items-start gap-2 mb-4">
        <Skeleton className="rounded-full w-12 h-12 bg-gray-300" />

        <div className=" flex flex-col">
          <Skeleton className="bg-gray-300 w-30 h-3 mb-2" />
          <Skeleton className="bg-gray-300 w-15 h-3" />
        </div>
      </div>

      <div>
        <Skeleton className="bg-gray-300 w-full h-3 mb-2" />
        <Skeleton className="bg-gray-300 w-full h-3 mb-2" />
        <Skeleton className="bg-gray-300 w-4/6 h-3" />
      </div>

      <Skeleton className="bg-gray-300 w-full h-60 mt-4" />
    </div>
  );
};

export default Post;
