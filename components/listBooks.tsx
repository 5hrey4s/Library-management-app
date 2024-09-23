"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import BookCard from "./ui/flipcard";
import PaginationControls from "./PaginationControls";
import { SearchParams } from "@/app/[locale]/home/books/page";
import { IBook, IBookBase } from "@/Models/book-model";
import { IMember } from "@/Models/member.model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import AddBook from "./addBook";
import { getMeanRating } from "@/lib/actions";

export interface ListBooksProps {
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  searchParams: SearchParams;
  role: string | undefined;
  items: IBook[];
  user: IMember;
  genres: string[];
  likedBooks: number[];
}

const ListBooks: React.FC<ListBooksProps> = ({
  pagination,
  searchParams,
  role,
  items,
  user,
  genres,
  likedBooks,
}) => {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const t = useTranslations("ListBooks");

  const page = parseInt(searchParams["page"] ?? "1");
  const perPage = parseInt(searchParams["per_page"] ?? "8");
  const sortBy = (searchParams["sortBy"] as keyof IBookBase) ?? "title";
  const sortOrder = searchParams["sortOrder"] ?? "asc";

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const newSearchParams = new URLSearchParams(currentSearchParams.toString());

    for (const [key, value] of formData.entries()) {
      if (value) {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    }

    router.replace(`/home/books?${newSearchParams.toString()}`);
  };

  const start = (page - 1) * perPage;
  const end = start + perPage;

  return (
    <Card className="w-full bg-[#E5E8E6] shadow-md border-none rounded-2xl mt-6">
      <CardHeader className="bg-[#D3D7D5] pt-6 rounded-t-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <CardTitle className="text-3xl font-bold text-[#4A5249]">
            {t("bookCatalog")}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4">
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-wrap items-center gap-2"
            >
              <Select name="sortBy" defaultValue={sortBy}>
                <SelectTrigger className="w-[140px] bg-white border-[#9FA8A0]">
                  <SelectValue placeholder={t("sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">{t("title")}</SelectItem>
                  <SelectItem value="author">{t("author")}</SelectItem>
                  <SelectItem value="publisher">{t("publisher")}</SelectItem>
                  <SelectItem value="genre">{t("genre")}</SelectItem>
                </SelectContent>
              </Select>
              <Select name="sortOrder" defaultValue={sortOrder}>
                <SelectTrigger className="w-[140px] bg-white border-[#9FA8A0]">
                  <SelectValue placeholder={t("order")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">
                    <div className="flex items-center">
                      <SortAsc className="w-4 h-4 mr-2" />
                      {t("ascending")}
                    </div>
                  </SelectItem>
                  <SelectItem value="desc">
                    <div className="flex items-center">
                      <SortDesc className="w-4 h-4 mr-2" />
                      {t("descending")}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                variant="default"
                className="bg-[#9FA8A0] hover:bg-[#8A9389] text-white transition-colors duration-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                {t("applyFilters")}
              </Button>
            </form>
            <AddBook />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {items.map(async (book) => (
            <BookCard
              key={book.isbnNo}
              data={{
                book,
                userId: user.id,
                role: role,
                isLiked: likedBooks.includes(book.id),
                rating: await getMeanRating(book.id),
              }}
            />
          ))}
        </div>
        {items.length === 0 && (
          <div className="text-center bg-[#F0F2F1] rounded-lg border border-[#9FA8A0] p-8 mt-8">
            <p className="text-lg text-[#4A5249]">{t("noBooksFound")}</p>
            <p className="text-sm text-[#6B746A] mt-2">{t("adjustFilters")}</p>
          </div>
        )}
        <div className="mt-12 flex justify-center">
          <PaginationControls
            hasNextPage={end < pagination.total}
            hasPrevPage={start > 0}
            totalPages={Math.ceil(pagination.total / perPage)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { ListBooks };
