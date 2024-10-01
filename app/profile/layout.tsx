import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/sidenav";
import { User, Activity, Settings } from "lucide-react";
import { auth } from "@/auth";
import Footer from "@/components/ui/footer";
import BookCard from "@/components/ui/flipcard";
import { fetchMemberByEmail } from "@/lib/data";

export const metadata: Metadata = {
  title: "Acme Library",
  description: "Manage your library effortlessly.",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await auth();
  const user = await fetchMemberByEmail(session?.user.email!);

  // This would typically come from your data fetching logic

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
          locale={locale}
          user={user!}
        />
        <div className="flex flex-1">
          <aside className="w-64 hidden md:block bg-[#F0FDF4]">
            <SideNav items={sideNavItems} activeItem="profile" />
          </aside>
          <div className="flex-1 p-4 bg-gray-100">{children}</div>
        </div>
        <Footer />
      </div>
    </>
  );
}
