"use server";
import Link from "next/link";
import SearchComponent from "@/components/search";
import { ListBooks } from "@/components/listBooks";
import { auth } from "@/auth";
import { fetchBooks, fetchGenre, fetchMemberByEmail } from "@/lib/data";
import { IBookBase } from "@/Models/book-model";
import { getWishListByMemberId } from "@/lib/actions";
import { getTranslations } from "next-intl/server";

export interface SearchParams {
  [key: string]: string | undefined;
}

interface HomeProps {
  searchParams: SearchParams;
  params: { locale: string };
}

export default async function Home({
  searchParams,
  params: { locale },
}: HomeProps) {
  const t = await getTranslations({ locale, namespace: "home" });

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
  const likedBooks = await getWishListByMemberId(user?.id!);

  return (
    <div className="flex flex-col min-h-screen bg-[#D3C9C9] text-gray-900">
      <div className="flex-1">
        {/* Search Section */}
        <section className="bg-[#9fa8a0] py-16 rounded-b-3xl shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl font-bold mb-6 text-white">
                  {t("headerTitle")} {/* Translated header title */}
                </h1>
                <div className="flex w-full max-w-md">
                  <SearchComponent
                    placeholder={t("searchPlaceholder")}
                    searchButtonText={t("searchButtonText")}
                  />
                  {/* Translated search placeholder */}
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
            likedBooks={likedBooks}
          />
        </section>
      </div>

      {/* Footer */}
      <div className="py-8 px-4 md:px-6 bg-[#9FA8A0] text-white">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm mb-4 sm:mb-0">
            {t("footer.copyright")} {/* Translated copyright */}
          </p>
          <nav className="flex gap-6">
            <Link
              className="text-sm hover:underline transition-colors duration-200"
              href="#"
            >
              {t("footer.terms")} {/* Translated terms of service */}
            </Link>
            <Link
              className="text-sm hover:underline transition-colors duration-200"
              href="#"
            >
              {t("footer.privacy")} {/* Translated privacy policy */}
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
