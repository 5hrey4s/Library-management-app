"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Heart,
  DollarSign,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IBook } from "@/Models/book-model";

interface LikedBooksGridProps {
  items: IBook[];
}

export function LikedBooksGrid({ items }: LikedBooksGridProps) {
  const [previewBook, setPreviewBook] = useState<IBook | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((book) => (
        <Card
          key={book.id}
          className="flex flex-col overflow-hidden transition-all duration-300"
        >
          <CardHeader className="p-0 relative">
            <div className="relative h-64 w-full">
              <Image
                src={book.image_url}
                alt={`Cover of ${book.title}`}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPreviewBook(book)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        {previewBook?.title}
                      </DialogTitle>
                      <DialogDescription className="text-lg">
                        {previewBook?.author}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="relative h-96 w-full rounded-lg overflow-hidden">
                        <Image
                          src={previewBook?.image_url || ""}
                          alt={`Cover of ${previewBook?.title}`}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          {previewBook?.title ||
                            "No description available."}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold">Genre</h4>
                            <p>{previewBook?.genre}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Publisher</h4>
                            <p>{previewBook?.publisher}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">ISBN</h4>
                            <p>{previewBook?.isbnNo}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Pages</h4>
                            <p>{previewBook?.numOfPages}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Available Copies</h4>
                            <p>{previewBook?.totalNumOfCopies}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Price</h4>
                            <p>${previewBook?.price.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button>Add to Cart</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
              {book.genre}
            </Badge>
          </CardHeader>
          <CardContent className="flex-grow p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
            <p className="text-sm line-clamp-2">{book.publisher}</p>
          </CardContent>
          <CardFooter className="p-4 bg-secondary/10 flex justify-between items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    {book.price.toFixed(2)}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current price</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setPreviewBook(book)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>Add to Cart</DropdownMenuItem>
                <DropdownMenuItem>Remove from Liked</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
