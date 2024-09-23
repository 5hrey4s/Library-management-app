"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Book, AlertTriangle, Phone, Mail, Calendar } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface IBookBase {
  title: string;
  author: string;
  publisher: string;
  genre: string;
  isbnNo: string;
  numOfPages: number;
  totalNumOfCopies: number;
  image_url: string;
  price: number;
}

interface IBook extends IBookBase {
  id: number;
  availableNumberOfCopies: number;
}

interface IMemberBase {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  refreshToken: string | null;
  accessToken: string | null;
  user_id: string;
  role: string;
}

interface IMember extends IMemberBase {
  id: number;
}

interface ITransactionBase {
  memberId: number;
  bookId: number;
}

interface ITransaction extends ITransactionBase {
  id: number;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  Status: string;
}

export interface DueBook extends IBook {
  transaction: ITransaction;
  borrower: IMember;
}

interface TodaysDuesProps {
  dues: DueBook[];
}

export function TodaysDues({ dues }: TodaysDuesProps) {
  const [selectedBook, setSelectedBook] = useState<DueBook | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Today's Due Returns</h2>
      <div className="relative">
        <div className="absolute inset-0 bg-wood-texture opacity-10 rounded-lg"></div>
        <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 bg-opacity-50 bg-gray-200 rounded-lg shadow-inner">
          <AnimatePresence>
            {dues.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card 
                        className="h-48 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
                        onClick={() => setSelectedBook(book)}
                      >
                        <CardContent className="p-0 h-full relative">
                          <Image
                            src={book.image_url}
                            alt={book.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-lg"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                            <p className="text-white text-xs font-semibold truncate">{book.title}</p>
                          </div>
                          <Badge className="absolute top-2 right-2 bg-red-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(book.transaction.dueDate)}
                          </Badge>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{book.title} by {book.author}</p>
                      <p>Due: {formatDate(book.transaction.dueDate)}</p>
                      <p>Borrowed by: {book.borrower.firstName} {book.borrower.lastName}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedBook?.title}</DialogTitle>
            <DialogDescription>by {selectedBook?.author}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-start gap-4">
              <Image
                src={selectedBook?.image_url || ''}
                alt={selectedBook?.title || ''}
                width={100}
                height={150}
                objectFit="cover"
                className="rounded-md"
              />
              <div>
                <p className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" /> {selectedBook?.borrower.firstName} {selectedBook?.borrower.lastName}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {selectedBook?.borrower.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {selectedBook?.borrower.phoneNumber}
                </p>
                <p className="text-sm font-semibold mt-2 flex items-center gap-2 text-red-500">
                  <AlertTriangle className="w-4 h-4" /> Due: {selectedBook && formatDate(selectedBook.transaction.dueDate)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="font-semibold">ISBN:</span> {selectedBook?.isbnNo}</p>
              <p><span className="font-semibold">Genre:</span> {selectedBook?.genre}</p>
              <p><span className="font-semibold">Pages:</span> {selectedBook?.numOfPages}</p>
              <p><span className="font-semibold">Publisher:</span> {selectedBook?.publisher}</p>
              <p><span className="font-semibold">Total Copies:</span> {selectedBook?.totalNumOfCopies}</p>
              <p><span className="font-semibold">Available:</span> {selectedBook?.availableNumberOfCopies}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-md">
              <h4 className="font-semibold mb-2">Transaction Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="font-semibold">Issue Date:</span> {selectedBook && formatDate(selectedBook.transaction.issueDate)}</p>
                <p><span className="font-semibold">Due Date:</span> {selectedBook && formatDate(selectedBook.transaction.dueDate)}</p>
                <p><span className="font-semibold">Status:</span> {selectedBook?.transaction.Status}</p>
                <p><span className="font-semibold">Transaction ID:</span> {selectedBook?.transaction.id}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setSelectedBook(null)}>Close</Button>
            <Button>Send Reminder</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}