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
  return (
    <div className="flex flex-col items-center m-6">
      <div
        className="relative w-72 h-96 cursor-pointer"
        onClick={handleFlip}
        style={{ perspective: "1000px" }}
      >
        <div
          className={clsx(
            "relative w-full h-full duration-700 transform",
            isFlipped ? "rotate-y-180" : ""
          )}
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.7s",
          }}
        >
          {/* Front Side */}
          <div className="absolute w-full h-full bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 border border-green-200 dark:border-gray-600 rounded-lg shadow-lg flex items-center justify-center p-4">
            <div className="absolute top-2 right-2 flex space-x-2">
              {data.role === "admin" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaEdit className="h-4 w-4" />
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
                              {/* <Button onClick={() => console.log("Edit book:", data.book.title)}>
                                Edit
                              </Button> */}

                              {data.role === "admin" && (
                                <EditButton id={book.id} />
                              )}
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
              )}

              {data.role === "admin" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaTrash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Book</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {data.book.title}?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              {data.role === "admin" && (
                                <button
                                  className="hover:bg-[#D33142] bg-[#e04050] mt-auto font-semibold py-2 px-4 rounded-lg shadow-md transition-colors text-white"
                                  onClick={handleDelete}
                                >
                                  Delete
                                </button>
                              )}
                              {/* <BorrowButton
                      className={`mt-auto font-semibold py-2 px-4 rounded-lg shadow-md transition-colors ${
                        isRequested
                          ? "bg-white text-black"
                          : "bg-[#357960] text-white"
                      }`} */}
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
              )}
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {data.book.title}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                by {data.book.author}
              </p>
            </div>
          </div>

          {/* Back Side */}
          <div
            className="absolute w-full h-full bg-white dark:bg-gray-800 border border-green-200 dark:border-gray-600 rounded-lg shadow-lg flex flex-col p-6 text-gray-800 dark:text-gray-200"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {data.book.title}
            </h3>
            <p className="mb-2 text-sm">
              <strong className="font-semibold">Author:</strong>{" "}
              {data.book.author}
            </p>
            <p className="mb-2 text-sm">
              <strong className="font-semibold">Publisher:</strong>{" "}
              {data.book.publisher}
            </p>
            <p className="mb-2 text-sm">
              <strong className="font-semibold">Genre:</strong>{" "}
              {data.book.genre}
            </p>
            <p className="mb-2 text-sm">
              <strong className="font-semibold">ISBN:</strong>{" "}
              {data.book.isbnNo}
            </p>
            <p className="mb-2 text-sm">
              <strong className="font-semibold">Pages:</strong>{" "}
              {data.book.numOfPages}
            </p>
            <p className="mb-2 text-sm">
              <strong className="font-semibold">Available Copies:</strong>{" "}
              {data.book.availableNumberOfCopies}
            </p>

            {/* Borrow Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className={`mt-auto font-semibold ${
                    isRequested
                      ? "bg-white text-black"
                      : "bg-[#357960] text-white"
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
                          ? "bg-white text-black"
                          : "bg-[#357960] text-white"
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
