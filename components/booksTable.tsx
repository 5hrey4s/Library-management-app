"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { Filter, SortAsc, SortDesc } from "lucide-react";
import AddBook from "./addBook";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteBook } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditButton from "./editBookButton";

export interface BooksTableProps {
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

const BooksTable: React.FC<BooksTableProps> = ({
  pagination,
  searchParams,
  role,
  items,
  user,
  genres,
}) => {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const t = useTranslations("ListBooks");
  const { toast } = useToast();

  const page = parseInt(searchParams["page"] ?? "1");
  const perPage = parseInt(searchParams["per_page"] ?? "10");
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

  const handleDelete = async (isbnNo: string, title: string) => {
    try {
      await deleteBook(isbnNo);
      toast({
        title: "Book Deleted",
        description: `"${title}" has been successfully deleted.`,
      });
      router.refresh(); // Refresh the page after deleting the book
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: `Failed to delete "${title}". Please try again.`,
        variant: "destructive",
      });
    }
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("author")}</TableHead>
              <TableHead>{t("publisher")}</TableHead>
              <TableHead>{t("genre")}</TableHead>
              <TableHead>{t("isbn")}</TableHead>
              <TableHead>{t("availableCopies")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((book) => (
              <TableRow key={book.isbnNo}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>{book.isbnNo}</TableCell>
                <TableCell>{book.availableNumberOfCopies}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white bg-opacity-80 hover:bg-opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaEdit className="h-4 w-4 text-blue-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Edit Book</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to edit {book.title}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <EditButton id={book.id} />
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-white bg-opacity-80 hover:bg-opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaTrash className="h-4 w-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Book</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {book.title}? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
                              onClick={() =>
                                handleDelete(book.isbnNo, book.title)
                              }
                            >
                              Delete
                            </button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

export { BooksTable };
