import Post from "@/components/Skeletons/Post";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="grid grid-cols-8 gap-2 mt-6">
      <section className="hidden md:inline col-span-2">
        <div className="relative bg-white rounded-xl ">
          <Skeleton className="w-full h-20 object-cover rounded-t-xl z-10 bg-gray-300" />

          <Skeleton className="absolute !rounded-full h-20 w-20 ml-4 -mt-10 border-2 border-white z-50 object-cover bg-gray-300" />

          <div className=" p-4 w-full flex flex-col items-start gap-4 mt-10">
            <Skeleton className="w-full h-5 bg-gray-300" />
            <Skeleton className="w-3/4 h-2 bg-gray-300" />
            <Skeleton className="w-3/4 h-2 bg-gray-300" />
          </div>
        </div>
      </section>

      <section className="col-span-8 md:col-span-6 lg:col-span-4">
        <div className="flex flex-col items-end p-4 border-b bg-white rounded-xl border-gray-200 mb-6">
          <Skeleton className="w-full h-10 bg-gray-300" />
          <Skeleton className="w-[100px] h-8 bg-gray-300 mt-4" />
        </div>

        {[1, 2].map((skeleton) => (
          <Post key={skeleton} />
        ))}
      </section>

      <section className="hidden lg:inline col-span-2">
        <Post />
      </section>
    </div>
  );
};

export default loading;
