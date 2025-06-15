import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="w-12 h-12 rounded-full bg-gray-300" />

      <div>
        <Skeleton className="w-[150px] h-3 bg-gray-300 mb-2" />
        <Skeleton className="w-[100px] h-3 bg-gray-300" />
      </div>
    </div>
  );
};

export default loading;
