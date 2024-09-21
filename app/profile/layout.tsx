import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/sidenav";
import { User, Activity, Settings } from "lucide-react";
import { auth } from "@/auth";
import Footer from "@/components/ui/footer";
import BookCard from "@/components/ui/flipcard";

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
  // This would typically come from your data fetching logic
  
  const sideNavItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Activity, label: "Activity", href: "/profile/activity" },
    { icon: Settings, label: "Settings", href: "/profile/settings" },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar
          logoText="Library"
          role={session?.user?.role}
          userName={session?.user?.name!}
        />
        <div className="flex flex-1">
          <aside className="w-64 hidden md:block bg-[#F0FDF4]">
            <SideNav items={sideNavItems} activeItem="profile" />
          </aside>
          <main className="flex-1 p-4 bg-gray-100">{children}</main>
        </div>
        
        <Footer />
      </div>
      <Toaster />
    </>
  );
}
