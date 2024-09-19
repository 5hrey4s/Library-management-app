"use client";

import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { deleteBook, updateRequestStatus } from "@/lib/data";
import { IBook } from "@/Models/book-model";
import BorrowButton from "./borrow";
import { IRequestBase } from "@/Models/request.model";
import clsx from "clsx";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditButton from "../editBookButton";
import Image from "next/image";

type BookCardProps = {
  data: {
    book: IBook;
    userId: number;
    role?: string | undefined;
  };
};

const BookCard: React.FC<BookCardProps> = ({ data }) => {
  const { book, userId } = data;
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRequested, setRequested] = useState(false);
  const { toast } = useToast();

  const handleFlip = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest("button")) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBook(data.book.isbnNo);
      toast({
        title: "Book Deleted",
        description: `"${data.book.title}" has been successfully deleted.`,
      });
      // You might want to trigger a re-fetch of the book list or update the UI here
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: `Failed to delete "${data.book.title}". Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleBorrow = async (data: IRequestBase) => {
    try {
      await updateRequestStatus(data);
      toast({
        title: "Request Submitted",
        description: "Your book request has been submitted successfully!",
      });
      setRequested(true);
    } catch (error) {
      console.error("Error borrowing the book:", error);
      toast({
        title: "Error",
        description: "Failed to submit book request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const AdminButtons = () => (
    <div className="absolute top-2 right-2 flex space-x-2 z-10">
      {data.role === "admin" && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
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
                        Are you sure you want to edit {data.book.title}?
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit book</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
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
                        Are you sure you want to delete {data.book.title}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
                          onClick={handleDelete}
                        >
                          Delete
                        </button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete book</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center m-6">
      <div
        className="relative w-72 h-96 cursor-pointer rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
        onClick={handleFlip}
        style={{ perspective: "1000px" }}
      >
        <div
          className={clsx(
            "relative w-full h-full duration-700 transform transition-transform",
            isFlipped ? "rotate-y-180" : ""
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={book.image_url || "/placeholder.svg"}
                alt={book.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 ease-in-out hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold mb-1 line-clamp-2">{data.book.title}</h3>
                <p className="text-sm opacity-80">{data.book.author}</p>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div
            className="absolute w-full h-full bg-white dark:bg-gray-800 flex flex-col p-6 text-gray-800 dark:text-gray-200 backface-hidden rotate-y-180 overflow-hidden"
          >
            <AdminButtons />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 line-clamp-2">
              {data.book.title}
            </h3>
            <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <p className="mb-2 text-sm">
                <strong className="font-semibold">Author:</strong> {data.book.author}
              </p>
              <p className="mb-2 text-sm">
                <strong className="font-semibold">Publisher:</strong> {data.book.publisher}
              </p>
              <p className="mb-2 text-sm">
                <strong className="font-semibold">Genre:</strong> {data.book.genre}
              </p>
              <p className="mb-2 text-sm">
                <strong className="font-semibold">ISBN:</strong> {data.book.isbnNo}
              </p>
              <p className="mb-2 text-sm">
                <strong className="font-semibold">Pages:</strong> {data.book.numOfPages}
              </p>
              <p className="mb-2 text-sm">
                <strong className="font-semibold">Available Copies:</strong> {data.book.availableNumberOfCopies}
              </p>
            </div>

            {/* Borrow Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className={`mt-4 font-semibold w-full ${
                    isRequested
                      ? "bg-gray-300 text-gray-600"
                      : "bg-[#357960] text-white hover:bg-[#2b6350]"
                  }`}
                  disabled={isRequested}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isRequested ? "Requested" : "Borrow"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Borrow Book</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to borrow {data.book.title}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <BorrowButton
                      className={`mt-auto font-semibold py-2 px-4 rounded-lg shadow-md transition-colors ${
                        isRequested
                          ? "bg-gray-300 text-gray-600"
                          : "bg-[#357960] text-white hover:bg-[#2b6350]"
                      }`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!isRequested) {
                          const reqData: IRequestBase = {
                            bookId: data.book.id,
                            memberId: data.userId,
                            status: "Pending",
                          };
                          await handleBorrow(reqData);
                          setRequested(true);
                        }
                      }}
                    >
                      {isRequested ? "Requested" : "Borrow"}
                    </BorrowButton>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;