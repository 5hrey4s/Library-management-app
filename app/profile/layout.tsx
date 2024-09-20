import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/sidenav";
import { User, Activity, Settings } from "lucide-react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Acme Library",
  description: "Manage your library effortlessly.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const sideNavItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Activity, label: "Activity", href: "/profile/activity" },
    { icon: Settings, label: "Settings", href: "/profile/settings" },
  ];

  return (
      <>
        <div className="min-h-screen flex flex-col">
          <Navbar logoText="Library" role={session?.user?.role} userName={session?.user?.name!} />
          <div className="flex flex-1">
            <aside className="w-64 hidden md:block">
              <SideNav items={sideNavItems} activeItem="profile" />
            </aside>
            <main className="flex-1 p-4 bg-gray-100">
              {children}
            </main>
          </div>
          <footer className="bg-green-600 text-white text-center py-4">
            &copy; 2024 Acme Library. All rights reserved.
          </footer>
        </div>
        <Toaster />
      </>
  );
}
