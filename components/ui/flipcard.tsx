"use client";

import { useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaBook,
  FaUser,
  FaBarcode,
  FaLayerGroup,
  FaCopy,
  FaDollarSign,
  FaHeart,
  FaStar,
} from "react-icons/fa";
import { deleteBook, updateRequestStatus } from "@/lib/data";
import { IBook } from "@/Models/book-model";
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
import { ITransactionBase } from "@/Models/transaction.model";
import BuyButton from "./borrow";
import { addWishList, removeWishList } from "@/lib/actions";

type BookCardProps = {
  data: {
    book: IBook;
    userId: number;
    role?: string | undefined;
    isLiked: boolean;
  };
};

const BookCard: React.FC<BookCardProps> = ({ data }) => {
  const { book, userId } = data;
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRequested, setRequested] = useState(false);
  const [isLiked, setIsLiked] = useState(data.isLiked);
  console.log(isLiked);
  const [rating, setRating] = useState(0);
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
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: `Failed to delete "${data.book.title}". Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleBorrow = async (data: ITransactionBase) => {
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

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (isLiked) {
      await removeWishList(book.id, data.userId);
    } else {
      await addWishList(data.book.id, data.userId);
    }
    toast({
      title: isLiked ? "Removed from Favorites" : "Added to Favorites",
      description: `"${data.book.title}" has been ${
        data.isLiked ? "removed from" : "added to"
      } your favorites.`,
    });
  };

  const handleRating = (value: number) => {
    setRating(value);
    toast({
      title: "Rating Submitted",
      description: `You've rated "${data.book.title}" ${value} stars.`,
    });
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
                        Are you sure you want to delete {data.book.title}? This
                        action cannot be undone.
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
                <h3 className="text-xl font-bold mb-1 line-clamp-2">
                  {data.book.title}
                </h3>
                <p className="text-sm opacity-80">{data.book.author}</p>
              </div>
              <button
                className={`absolute top-4 right-4 p-2 rounded-full ${
                  isLiked ? "bg-red-500" : "bg-white bg-opacity-50"
                } transition-colors duration-200`}
                onClick={handleLike}
              >
                <FaHeart
                  className={`h-5 w-5 ${
                    isLiked ? "text-white" : "text-red-500"
                  }`}
                />
              </button>
              <div className="absolute top-4 left-4 flex items-center bg-white bg-opacity-75 rounded-full px-2 py-1">
                <FaStar className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm font-semibold text-gray-800">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute w-full h-full bg-white dark:bg-gray-800 flex flex-col p-6 text-gray-800 dark:text-gray-200 backface-hidden rotate-y-180 overflow-hidden">
            <AdminButtons />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 line-clamp-2">
              {data.book.title}
            </h3>
            <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 space-y-3">
              <div className="flex items-center">
                <FaUser className="w-5 h-5 mr-2 text-gray-500" />
                <p className="text-sm">
                  <span className="font-semibold">Author:</span>{" "}
                  {data.book.author}
                </p>
              </div>
              <div className="flex items-center">
                <FaBook className="w-5 h-5 mr-2 text-gray-500" />
                <p className="text-sm">
                  <span className="font-semibold">Publisher:</span>{" "}
                  {data.book.publisher}
                </p>
              </div>
              <div className="flex items-center">
                <FaLayerGroup className="w-5 h-5 mr-2 text-gray-500" />
                <p className="text-sm">
                  <span className="font-semibold">Genre:</span>{" "}
                  {data.book.genre}
                </p>
              </div>
              <div className="flex items-center">
                <FaBarcode className="w-5 h-5 mr-2 text-gray-500" />
                <p className="text-sm">
                  <span className="font-semibold">ISBN:</span>{" "}
                  {data.book.isbnNo}
                </p>
              </div>
              <div className="flex items-center">
                <span className="w-5 h-5 mr-2 text-gray-500 flex items-center justify-center font-bold">
                  P
                </span>
                <p className="text-sm">
                  <span className="font-semibold">Pages:</span>{" "}
                  {data.book.numOfPages}
                </p>
              </div>
              <div className="flex items-center">
                <FaCopy className="w-5 h-5 mr-2 text-gray-500" />
                <p className="text-sm">
                  <span className="font-semibold">Available Copies:</span>{" "}
                  {data.book.availableNumberOfCopies}
                </p>
              </div>
              <div className="flex items-center">
                <FaDollarSign className="w-5 h-5 mr-2 text-gray-500" />
                <p className="text-sm">
                  <span className="font-semibold">Price:</span> $
                  {book.price || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`mx-1 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRating(star);
                  }}
                >
                  <FaStar className="h-6 w-6" />
                </button>
              ))}
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <BuyButton
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
                  price={book.price || 0}
                  onClick={(e) => e.stopPropagation()}
                >
                  Buy Now
                </BuyButton>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to buy {data.book.title} for $
                    {book.price || "N/A"}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <BuyButton
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
                      price={book.price || 0}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const reqData: ITransactionBase = {
                          bookId: data.book.id,
                          memberId: data.userId,
                        };
                        await handleBorrow(reqData);
                        toast({
                          title: "Purchase Successful",
                          description: `You have successfully purchased "${data.book.title}".`,
                          variant: "default",
                        });
                      }}
                    >
                      Confirm Purchase
                    </BuyButton>
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
