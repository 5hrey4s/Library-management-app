import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import '../globals.css'



export const metadata: Metadata = {
  title: "Acme Library Management System",
  description:
    "Streamline your library operations with our powerful and intuitive platform.",
};



export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await auth();
  return (
      <main lang="en">
      <Navbar logoText="Library" role={session?.user!.role} userName={session?.user.name!} />

          {children}
          <div className="w-full flex-none md:w-64">
          </div>

          <Toaster />
      </main>
  );
}
