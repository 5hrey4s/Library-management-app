"use server";
import Link from "next/link";
import SearchComponent from "@/components/search";
import { auth } from "@/auth";
import TransactionsTable from "@/components/transactionTable";
import { fetchMemberByEmail, fetchTransaction } from "@/lib/data";
import { Suspense } from "react";
import TableSkeleton from "@/components/TableSkeleton";
import { ITransactionBase } from "@/Models/transaction.model";

export interface SearchParams {
  [key: string]: string | undefined;
}

interface HomeProps {
  searchParams: SearchParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const page = parseInt(searchParams["page"] ?? "1");
  const limit = 8;
  const sortBy =
    (searchParams["sortBy"] as keyof ITransactionBase) || "issueDate";
  const sortOrder = searchParams["sortOrder"] || "asc";

  const offset = (page - 1) * limit;
  const pageRequest = {
    offset: offset,
    limit: limit,
    search: searchParams["search"] ?? "",
  };
  const sortOptions = { sortOrder: sortOrder, sortBy: sortBy };
  const { items, pagination } = await fetchTransaction(
    pageRequest,
    sortOptions
  );
  const session = await auth();
  const user = await fetchMemberByEmail(session?.user.email!);
  if (session?.user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F7] text-gray-900 dark:text-gray-100">
      {/* <Navbar logoText="Library" active="Transactions" role = {session?.user!.role}/> */}

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

        <section className="container mx-auto bg-[#F5F5F7] py-8">
          <Suspense fallback={<TableSkeleton columns={5} rows={9} />}>
            <TransactionsTable
              pagination={pagination}
              searchParams={searchParams}
              transactions={items}
              user={user!}
            />
          </Suspense>
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
