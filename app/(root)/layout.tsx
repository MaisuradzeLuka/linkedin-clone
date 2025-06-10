import { createOrGetUser } from "@/actions/user";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { userId } = await auth();

  const user = await createOrGetUser({ get: { userId: userId || "" } });

  if (user.message === "User not found") redirect("/onboarding");
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 lg:px-0">
      {children}
    </main>
  );
};

export default layout;
