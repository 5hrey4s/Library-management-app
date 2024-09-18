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
}

const ListBooks: React.FC<ListBooksProps> = ({
  pagination,
  searchParams,
  role,
  items,
  user,
  genres,
}) => {
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  const page = parseInt(searchParams["page"] ?? "1");
  const perPage = parseInt(searchParams["per_page"] ?? "8");
  const sortBy = (searchParams["sortBy"] as keyof IBookBase) ?? "title";
  const sortOrder = searchParams["sortOrder"] ?? "asc";
  const searchTerm = searchParams["searchTerm"] ?? "";
  const genreFilter = searchParams["genre"] ?? "all";

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const newSearchParams = new URLSearchParams(currentSearchParams.toString());

    // Update only the changed params
    for (const [key, value] of formData.entries()) {
      if (value) {
        newSearchParams.set(key, value.toString());
      } else {
        newSearchParams.delete(key);
      }
    }
    // newSearchParams.set('page', '1');

    router.replace(`/home/books?${newSearchParams.toString()}`);
  };

  // Calculate start and end indices for pagination
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-2xl font-bold">Book Catalog</CardTitle>
          <AddBook />
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleFormSubmit}
          className="mb-6 flex flex-col sm:flex-row justify-end items-center gap-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Select name="sortBy" defaultValue={sortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
              <SelectTrigger className="w-full sm:w-[100px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-[90%] md:w-auto">
            Apply
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {items.map((book) => (
            <BookCard
              key={book.isbnNo}
              data={{ book, userId: user.id, role: role }}
            />
          ))}
        </div>
        {items.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No books found matching your search criteria.
          </p>
        )}
        <div className="mt-8 flex justify-center">
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
