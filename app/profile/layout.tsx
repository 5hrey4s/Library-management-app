import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/sidenav";
import { booksRead, CurrentlyReading, fetchMemberByEmail } from "@/lib/data";
import {
  BookOpen,
  BookMarked,
  User,
  Activity,
  Settings,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acme Library Management System",
  description:
    "Streamline your library operations with our powerful and intuitive platform.",
};

async function getUserData() {
  const session = await auth();
  const member = await fetchMemberByEmail(session?.user?.email as string);
  return {
    name: session?.user?.name,
    email: session?.user?.email,
    avatar: session?.user.image,
    memberSince: "January 2023",
    booksRead: booksRead(session?.user?.email!),
    currentlyReading: CurrentlyReading(session?.user?.email!),
    ...member,
  };
}

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserData();

  const sideNavItems = [
    { icon: User, label: "Profile", href: `/profile` },
    { icon: Activity, label: "Activity", href: "/profile/activity" },
    { icon: Settings, label: "Settings", href: "/profile/settings" },
    // { icon: CreditCard, label: "Billing", href: "/profile/billing" },
    // { icon: HelpCircle, label: "Help", href: "/profile/help" },
  ];

  // Determine the active tab based on routing or context
  const activeTab = "profile"; // This should be dynamically set
  const session = await auth();

  return (
    <AuthProvider>
      <div>
        <Navbar logoText="Library" role={session?.user!.role} userName={session?.user.name!} />
        <div className="flex">
          <SideNav items={sideNavItems} activeItem={activeTab} />
          <div className="flex-1 p-8">{children}</div>
        </div>
        <Toaster />
      </div>
    </AuthProvider>
  );
}
