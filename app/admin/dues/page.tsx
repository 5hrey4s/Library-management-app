"use server";

import Link from "next/link";
import SearchComponent from "@/components/search";
import { ListBooks } from "@/components/listBooks";
import { auth } from "@/auth";
import { fetchBooks, fetchGenre, fetchMemberByEmail } from "@/lib/data";
import { IBookBase } from "@/Models/book-model";
import { getWishListByMemberId, todaysDues } from "@/lib/actions";
import { getTranslations } from "next-intl/server";
import { TodaysDues } from "@/components/TodaysDues";
import UnauthorizedAccess from "@/app/unauthorized/unauthorized";

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
  const dues = await todaysDues();
  const session = await auth();
  if (session?.user.role !== "admin") {
    return (
        <UnauthorizedAccess />
    );
  }
  return <TodaysDues dues={dues} />;
}
