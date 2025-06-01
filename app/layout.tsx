import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/shared/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Linkedin",
  description: "Connect with using linkin-clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex flex-col antialiased  h-screen bg-[#F4F2EE] ">
          <header className="border-b border-gray-300 sticky top-0 bg-white z-50">
            <Header />
          </header>

          <main className="flex-1 w-full max-w-6xl mx-auto px-4 lg:px-0">
            {children}
          </main>

          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
