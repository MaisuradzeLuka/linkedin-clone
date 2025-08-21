import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/shared/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { auth } from "@clerk/nextjs/server";
import { createOrGetUser } from "@/actions/user";
import { ImageKitProvider } from "@imagekit/next";

export const metadata: Metadata = {
  title: "Linkedin",
  description: "Connect with using linkin-clone",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  const user = await createOrGetUser({ get: { userId: userId || "" } });

  return (
    <ClerkProvider>
      <ImageKitProvider urlEndpoint="https://ik.imagekit.io/codeverse">
        <html lang="en">
          <body className="h-screen flex flex-col antialiased bg-[#F4F2EE] ">
            <header className="border-b border-gray-300 sticky top-0 bg-white z-50">
              <Header userId={userId} user={user} />
            </header>

            {children}
            <Toaster />
          </body>
        </html>
      </ImageKitProvider>
    </ClerkProvider>
  );
}
