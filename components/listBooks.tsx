"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookCard from "./ui/flipcard";
import PaginationControls from "./PaginationControls";
import { SearchParams } from "@/app/home/books/page";
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
import AddBook from "./addBook";

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
  const page = parseInt(searchParams["page"] ?? "1");
  const perPage = parseInt(searchParams["per_page"] ?? "8");
  const sortBy = (searchParams["sortBy"] as keyof IBookBase) ?? "title";
  const sortOrder = searchParams["sortOrder"] ?? "asc";

  // const isLiked =

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
    <Card className="w-full bg-[#d3c9c9] shadow-sm border border-none rounded-2xl">
      <CardHeader className="bg-[#D3C9C9]">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Book Catalog
          </CardTitle>
          <AddBook />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form
          onSubmit={handleFormSubmit}
          className="mb-8 p-4 bg-[#D3C9C9] flex flex-col sm:flex-row justify-end items-center gap-4"
        >
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <Select name="sortBy" defaultValue={sortBy}>
              <SelectTrigger className="w-full sm:w-[180px] bg-[white] border-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="publisher">Publisher</SelectItem>
                <SelectItem value="genre">Genre</SelectItem>
              </SelectContent>
            </Select>
            <Select name="sortOrder" defaultValue={sortOrder}>
              <SelectTrigger className="w-full sm:w-[120px] bg-white border-gray-300">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
          >
            Apply Filters
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {items.map((book) => (
            <BookCard
              key={book.isbnNo}
              data={{
                book,
                userId: user.id,
                role: role,
                isLiked: likedBooks.includes(book.id),
              }}
            />
          ))}
        </div>
        {items.length === 0 && (
          <div className="text-center bg-gray-50 rounded-lg border border-gray-200 p-8 mt-8">
            <p className="text-lg text-gray-600">
              No books found matching your search criteria.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your filters or browse our full collection.
            </p>
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
