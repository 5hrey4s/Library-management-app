import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import "../globals.css";
import { fetchMemberByEmail } from "@/lib/data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acme Library Management System",
  description:
    "Streamline your library operations with our powerful and intuitive platform.",
};

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await auth();
  const user = await fetchMemberByEmail(session?.user.email!);
  return (
    <div lang="en">
      <Navbar
        logoText="Library"
        role={session?.user!.role}
        userName={session?.user.name!}
        locale={locale}
        user={user!}
      />

      {children}
      <div className="w-full flex-none md:w-64"></div>

      <Toaster />
    </div>
  );
}
