"use server";
import Link from "next/link";
import SearchComponent from "@/components/search";

import MyTransactionTable from "@/components/MyTransactionTable";
import { auth } from "@/auth";
import { IMember } from "@/Models/member.model";
import { fetchMemberByEmail, fetchMyTransactions } from "@/lib/data";
import { ITransaction } from "@/Models/transaction.model";
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
  const session = await auth();
  const email = session?.user?.email;

  // Fetch the current user based on email
  const user: IMember | null = await fetchMemberByEmail(email!);

  // Fetch transactions for the logged-in user
  const transactions: ITransaction[] = await fetchMyTransactions(user!.id);
  return (
    <div className="flex flex-col min-h-screen bg-[rgb(245,245,247)] text-gray-900 dark:text-gray-100">
      {/* <Navbar logoText="Library" active="MyTransactions" role = {session?.user!.role}/> */}

      <div className="flex-1 bg-[#F5F5F7]-50 ">
        <section className="bg-green-50 py-12 rounded-lg">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-3xl font-bold mb-4">
                {t("headerTitle")} {/* Translated header title */}
                </h1>
                <div className="flex">
                  <SearchComponent
                    placeholder={t("searchPlaceholder")}
                    searchButtonText={t("searchButtonText")}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto bg-[#F5F5F7]">
          <MyTransactionTable
            searchParams={searchParams}
            transactions={transactions}
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
