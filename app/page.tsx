"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Clock, Search, LogIn, UserPlus, Plus } from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useState, useEffect } from "react";
import { ClientSafeProvider, LiteralUnion } from "next-auth/lib/client";
import AddBook from "@/components/addBook";

type ProvidersType = Record<
  LiteralUnion<ClientSafeProvider['id'], string>,
  ClientSafeProvider
> | null;

export default function WelcomePage() {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<ProvidersType>(null);

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    }
    setAuthProviders();
  }, []);

  console.log("providers:", providers);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="px-4 lg:px-6 h-16 fixed w-full bg-[#FFFFFF] dark:bg-gray-800 shadow-md flex items-center justify-between">
        <Link className="flex items-center" href="#">
        <BookOpen className="h-12 w-12 text-[#2F8D46] " />
          <span className="sr-only">Acme Library</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="bg-[#273239] text-white flex items-center">
              <LogIn className="h-5 w-5 mr-2" />
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className= "text-white flex items-center w-[120px] bg-[#273239]">
              <UserPlus className="h-5 w-5 mr-2" />
              Sign Up
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 pt-20">
        <section className="w-full py-24 bg-[#f0fdf4] from-teal-500 to-teal-600 text-black text-center">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">Welcome to the Library! Your gateway to endless knowledge and adventure awaits.</h1>
          <p className="mt-4 max-w-lg mx-auto text-lg sm:text-xl">Streamline your library operations with our powerful and intuitive platform.</p>
          <Button size="lg" className="mt-8 bg-[#357960] text-white">
            <Link href="#dashboard">Get Started</Link>
          </Button>
        </section>
        <section className="w-full py-16 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">Key Features</h2>
            <div className="grid gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="transition-transform duration-300 transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <BookOpen className="h-6 w-6 text-teal-500" />
                    Catalog Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-400">
                  Effortlessly manage your library's collection with our advanced cataloging system.
                </CardContent>
              </Card>
              <Card className="transition-transform duration-300 transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Users className="h-6 w-6 text-teal-500" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-400">
                  Keep track of members, their borrowing history, and preferences with ease.
                </CardContent>
              </Card>
              <Card className="transition-transform duration-300 transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Clock className="h-6 w-6 text-teal-500" />
                    Circulation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-400">
                  Streamline check-outs, returns, and reservations with our efficient circulation module.
                </CardContent>
              </Card>
              <Card className="transition-transform duration-300 transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Search className="h-6 w-6 text-teal-500" />
                    Advanced Search
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 dark:text-gray-400">
                  Find any resource quickly with our powerful and intuitive search functionality.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col sm:flex-row py-6 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-4 md:px-6 border-t dark:border-gray-700">
        <p className="text-xs">© 2023 Acme Library Management System. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4">
          <Link href="#" className="text-xs hover:underline">Terms of Service</Link>
          <Link href="#" className="text-xs hover:underline">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
}
