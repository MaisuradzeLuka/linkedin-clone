import Post from "@/components/Skeletons/Post";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="flex flex-col items-center mt-10">
      <section className="w-full md:w-max">
        <Skeleton className="w-full md:w-[700px] rounded-4xl object-cover h-[230px] bg-gray-300" />

        <div className="w-[95%] mx-auto flex items-end justify-between">
          <Skeleton className="w-22 h-22 md:w-25 md:h-25 rounded-full p-[2px] border border-white bg-gray-300 -mt-12" />
        </div>

        <div className="flex flex-col mt-8">
          <Skeleton />
        </div>
      </section>

      <section className="w-full md:w-[700px] mt-8">
        {[1, 2].map((skeleton) => (
          <Post key={skeleton} />
        ))}
      </section>
    </div>
  );
};

export default loading;
