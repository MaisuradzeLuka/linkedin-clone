import PostFeed from "@/components/shared/PostFeed";
import UserInfo from "@/components/shared/UserInfo";
import React from "react";

const page = () => {
  return (
    <div className="grid grid-cols-8 gap-2 mt-6">
      <section className="hidden md:inline col-span-2">
        <UserInfo />
      </section>

      <section className="col-span-8 md:col-span-6">
        <PostFeed />
      </section>

      <section></section>
    </div>
  );
};

export default page;
