import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import '../globals.css'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acme Library Management System",
  description:
    "Streamline your library operations with our powerful and intuitive platform.",
};



export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await auth();
  return (
    <AuthProvider>
      <main lang="en">
      <Navbar logoText="Library" role={session?.user!.role} userName={session?.user.name!} />

          {children}
          <div className="w-full flex-none md:w-64">
          </div>

          <Toaster />
      </main>
    </AuthProvider>
  );
}
