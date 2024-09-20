import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Acme Library Management System",
  description:
    "Streamline your library operations with our powerful and intuitive platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="w-full flex-none md:w-64">
          {/* Your content here */}
        </div>
        
        {children}
        <Toaster />
      </body>
    </html>
  );
}
