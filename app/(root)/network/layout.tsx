import { createOrGetUser } from "@/actions/user";
import NetworkNav from "@/components/shared/NetworkNav";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import Link from "next/link";
import React from "react";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { userId } = await auth();

  const existingUser = await createOrGetUser({ get: { userId: userId || "" } });

  return (
    <div className="max-w-[700px] flex flex-col items-start mt-10 mx-auto bg-white rounded-xl border-[1px] border-[#d1d1ce]">
      <section className="w-full">
        <h1 className="my-3 mx-5 text-lg">
          {existingUser.firstname}`s Network
        </h1>

        <div className="w-full h-[1px] bg-[#d1d1ce]" />

        <NetworkNav />

        <div className="w-full h-[1px] bg-[#d1d1ce]" />
      </section>

      <section className="w-full my-3 px-5">{children}</section>
    </div>
  );
};

export default layout;
