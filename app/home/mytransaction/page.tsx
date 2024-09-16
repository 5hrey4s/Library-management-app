"use server";
import { BookOpen, ChevronDown, LogIn, Plus } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/handlelogout";
import SearchComponent from "@/components/search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AddBook from "@/components/addBook";
import ListMembers from "@/components/members";
import MemberTable from "@/components/MemberTable";
import Books from "@/components/book";
import Members from "@/components/members";
import RequestTable from "@/components/requestTable";
import MyBooks from "@/components/mybooks";
import Requests from "@/components/requests";
import TransactionTable from "@/components/transactionTable";
import Profile from "@/components/profile";
import MyTransactionTable from "@/components/MyTransactionTable";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";

export interface SearchParams {
  [key: string]: string | undefined;
}

interface HomeProps {
  searchParams: SearchParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const pageRequest = {
    offset: 0,
    limit: 999,
    search: searchParams["search"] ?? "",
  };
  const session = await auth()

  return (
    <div className="flex flex-col min-h-screen bg-[rgb(245,245,247)] text-gray-900 dark:text-gray-100">
      {/* <Navbar logoText="Library" active="MyTransactions" role = {session?.user!.role}/> */}

      <main className="flex-1 bg-[#F5F5F7]-50 ">
        <section className="bg-green-50 py-12 rounded-lg">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl font-bold mb-4">
                  Explore Our Library Collection{" "}
                </h1>
                <div className="flex">
                  <SearchComponent placeholder="Search books..." />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto bg-[#F5F5F7]">
          <MyTransactionTable searchParams={searchParams} />
        </section>
      </main>

      <footer className="flex flex-col sm:flex-row items-center justify-between py-6 px-4 md:px-6 bg-white dark:bg-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Acme Library. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            className="text-xs text-blue-600 hover:underline dark:text-teal-400 dark:hover:underline"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs text-blue-600 hover:underline dark:text-teal-400 dark:hover:underline"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
