"use client";

import React, { useState, useEffect } from "react";
import { IBook } from "@/Models/book-model";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import BookCard from "./ui/flipcard";
import PaginationControls from "./PaginationControls";
import { IPageRequest } from "@/core/pagination";
import { SearchParams } from "@/app/home/books/page";

interface ClientSideSearchProps {
  books: IBook[];
  sortBy: "title" | "author" | undefined;
  searchParams: SearchParams;
  pageRequest: IPageRequest;
}

const ClientSideSearch: React.FC<ClientSideSearchProps> = ({ books, sortBy, searchParams, pageRequest }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localSortBy, setLocalSortBy] = useState(sortBy || "title");
  const [filteredBooks, setFilteredBooks] = useState(books);
  const router = useRouter();
  const searchParamsObj = useSearchParams();

  useEffect(() => {
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      if (localSortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (localSortBy === "author") {
        return a.author.localeCompare(b.author);
      }
      return 0;
    });

    setFilteredBooks(sorted);
  }, [searchTerm, localSortBy, books]);

  const handleSortChange = (value: string) => {
    setLocalSortBy(value as "title" | "author");
    const params = new URLSearchParams(searchParamsObj.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`);
  };

  const page = parseInt(searchParams["page"] ?? "1");
  const perPage = parseInt(searchParams["per_page"] ?? "8");

  // Calculate start and end indices for pagination
  const start = (page - 1) * perPage;
  const end = start + perPage;

  // Slice items array to get the current page's items
  const currentPageBooks = filteredBooks.slice(start, end);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-4 py-2 w-full"
          />
        </div>
        <Select value={localSortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Sort by Title</SelectItem>
            <SelectItem value="author">Sort by Author</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={{ gridAutoRows: "1fr" }}>
        {currentPageBooks.map((book) => (
          <BookCard key={book.id} data={{ book, userId: book.id }} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <PaginationControls
          hasNextPage={end < filteredBooks.length}
          hasPrevPage={start > 0}
          totalPages={Math.ceil(filteredBooks.length / perPage)}
        />
      </div>
    </>
  );
};

export default ClientSideSearch;    