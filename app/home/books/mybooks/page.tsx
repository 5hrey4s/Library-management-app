import Link from "next/link";
import SearchComponent from "@/components/search";
import { ListMyBooks } from "@/components/ListMyBooks";
import { auth } from "@/auth";
import { fetchGenre, fetchMemberByEmail, fetchMyBooks } from "@/lib/data";
import { getWishListByMemberId } from "@/lib/actions";
import { IBook } from "@/Models/book-model";
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

  const pageRequest = {
    offset: 0,
    limit: 999,
    search: searchParams["search"] ?? "",
  };

  const genres: string[] = await fetchGenre();
  const session = await auth();
  const email = session?.user?.email;
  const user = await fetchMemberByEmail(session?.user.email!);
  const likedBooks = await getWishListByMemberId(user?.id!);
  const items: IBook[] = await fetchMyBooks(user!.id);
  return (
    <div className="flex flex-col min-h-screen bg-[#D3C9C9] text-gray-900 dark:text-gray-100">
      <div className="flex-1 bg-[#F5F5F7]-50">
        <section className="bg-[#9fa8a0] py-16 rounded-b-3xl shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl font-bold mb-6 text-black">
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
        <section className="container mx-auto relative py-12 px-4">
          <div className="absolute top-0 right-0 -mt-4 mr-4"></div>
          <ListMyBooks
            searchParams={searchParams}
            role={session?.user!.role}
            items={items}
            genres={genres}
            user={user!}
            likedBooks={likedBooks}
            locale={locale}

          />
        </section>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between py-6 px-4 md:px-6 bg-white dark:bg-gray-800">
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
      </div>
    </div>
  );
}
