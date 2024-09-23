"use server";
import Link from "next/link";
import SearchComponent from "@/components/search";
import MemberTable from "@/components/MemberTable";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { Suspense } from "react";
import TableSkeleton from "@/components/TableSkeleton";
import { fetchGenre, fetchMemberByEmail, fetchMembers } from "@/lib/data";
import { IBookBase } from "@/Models/book-model";
import { IMemberBase } from "@/Models/member.model";
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
  const sortBy = (searchParams["sortBy"] as keyof IMemberBase) || "firstName";
  const sortOrder = searchParams["sortOrder"] || "asc";

  const offset = (page - 1) * limit;
  const pageRequest = {
    offset: offset,
    limit: limit,
    search: searchParams["search"] ?? "",
  };
  const sortOptions = { sortOrder: sortOrder, sortBy: sortBy };
  const { items, pagination } = await fetchMembers(pageRequest, sortOptions);
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
      {/* <Navbar logoText="Library" active="Members" role={session?.user!.role} /> */}

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

        <section className="container mx-auto bg-[#F5F5F7] py-8">
          {/* <ListBooks pageRequest={pageRequest} searchParams={searchParams} /> */}
          <Suspense fallback={<TableSkeleton columns={5} rows={9} />}>
            <MemberTable
              pagination={pagination}
              searchParams={searchParams}
              items={items}
            />
          </Suspense>
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
