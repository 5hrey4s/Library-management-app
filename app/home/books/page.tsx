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

  return (
    <div className="flex flex-col min-h-screen bg-[#dbd3d3] text-gray-900">
      <main className="flex-1">
        {/* Search Section */}
        <section className="bg-[#9fa8a0] py-16 rounded-b-3xl shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl font-bold mb-6 text-white">
                  Explore Our Library Collection
                </h1>
                <div className="flex w-full max-w-md">
                  <SearchComponent placeholder="Search books..." />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Book List Section */}
        <section className="container mx-auto relative py-12 px-4">
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
      <footer className="py-8 px-4 md:px-6 bg-[#308D46] text-white">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm mb-4 sm:mb-0">
            © 2024 Acme Library. All rights reserved.
          </p>
          <nav className="flex gap-6">
            <Link
              className="text-sm hover:underline transition-colors duration-200"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-sm hover:underline transition-colors duration-200"
              href="#"
            >
              Privacy Policy  
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}