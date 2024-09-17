import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/sidenav";
import { User, Activity, Settings } from "lucide-react";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acme Library Management System",
  description:
    "Streamline your library operations with our powerful and intuitive platform.",
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
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar logoText="Library" role={session?.user?.role} userName={session?.user?.name!} />
            <div className="flex flex-1 flex-col md:flex-row">
              <aside className="md:w-64 md:block">
                {/* Side navigation should be hidden on small screens */}
                <SideNav items={sideNavItems} activeItem="profile" className="hidden md:block" />
              </aside>
              <main className="flex-1 p-4 md:p-8 bg-[#f5f5f5]">
                <div className="max-w-4xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
            <footer className="bg-[#2f8d46] text-white py-4 text-center">
              <p>&copy; 2024 Acme Library Management System. All rights reserved.</p>
            </footer>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
