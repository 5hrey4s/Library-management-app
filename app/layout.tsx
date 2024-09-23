import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
const inter = Inter({ subsets: ["latin"] });
import { routing } from "@/i18n/routing";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
  const locale = await getLocale();

  const messages = await getMessages();

  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <div className="w-full flex-none md:w-64">
          {/* Your content here */}
        </div>

        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
