"use server";

import Link from "next/link";
import SearchComponent from "@/components/search";
import { ListBooks } from "@/components/listBooks";
import { auth } from "@/auth";
import { fetchBooks, fetchGenre, fetchMemberByEmail } from "@/lib/data";
import { IBookBase } from "@/Models/book-model";

export interface SearchParams {
  [key: string]: string | undefined;
}

interface HomeProps {
  searchParams: SearchParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const page = parseInt(searchParams["page"] ?? "1");
  const limit = 8;
  const sortBy = (searchParams["sortBy"] as keyof IBookBase) || "title";
  const sortOrder = searchParams["sortOrder"] || "asc";

  const offset = (page - 1) * limit;
  const pageRequest = {
    offset: offset,
    limit: limit,
    search: searchParams["search"] ?? "",
  };
  const sortOptions = { sortOrder: sortOrder, sortBy: sortBy };
  const { items, pagination } = await fetchBooks(pageRequest, sortOptions);
  const session = await auth();
  const genres = await fetchGenre();
  const user = await fetchMemberByEmail(session?.user.email!);
  console.log(items);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F7] text-gray-900 dark:text-gray-100">
      {/* <Navbar logoText="Library" active="Books" role={session?.user!.role} /> */}

      {/* Main Content */}
      <main className="flex-1">
        {/* Search Section */}
        <section className="bg-green-50 py-12 rounded-lg">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl font-bold mb-4">
                  Explore Our Library Collection
                </h1>
                <div className="flex">
                  <SearchComponent placeholder="Search books..." />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Book List Section */}
        <section className="container mx-auto relative py-8">
          <div className="absolute top-0 right-0 -mt-4 mr-4"></div>
          <ListBooks
            pagination={pagination}
            searchParams={searchParams}
            role={session?.user!.role}
            items={items}
            genres={genres}
            user={user!}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between py-6 px-4 md:px-6 bg-white dark:bg-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Acme Library. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            className="text-xs text-blue-600 hover:underline dark:text-teal-400"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs text-blue-600 hover:underline dark:text-teal-400"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
