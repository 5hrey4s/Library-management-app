"use server";
import { IPageRequest, IPagesResponse } from "@/core/pagination";
import { Books, Transactions } from "@/drizzle/schema";
import { IBook, IBookBase } from "@/Models/book-model";
import { IMemberBase } from "@/Models/member.model";
import { IRequestBase } from "@/Models/request.model";
import { BookRepository } from "@/Repositories/book-repository";
import { MemberRepository } from "@/Repositories/member.repository";
import { RequestRepository } from "@/Repositories/request.repository";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { revalidatePath } from "next/cache";
import { and, eq, like, or } from "drizzle-orm";
import { TransactionRepository } from "@/Repositories/transaction.repository";
import { ITransaction } from "@/Models/transaction.model";
import { Appenv } from "@/read-env";

const pool = mysql.createPool(Appenv.DATABASE_URL);
const db = drizzle(pool);
const bookRepository = new BookRepository(db);
const memberRepository = new MemberRepository(db);
const requestRepository = new RequestRepository(db);
const transactionRepository = new TransactionRepository(db);

export const fetchBooks = async (pageRequest: IPageRequest) => {
  try {
    const books = await bookRepository.list(pageRequest);
    return books;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchMembers = async (pageRequest: IPageRequest) => {
  try {
    const members = await memberRepository.list(pageRequest);
    return members;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchMemberByEmail = async (email: string) => {
  try {
    const member = await memberRepository.getByEmail(email);
    return member;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchRequests = async (pageRequest: IPageRequest) => {
  try {
    const requests = await requestRepository.list(pageRequest);
    return requests;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchTransaction = async (pageRequest: IPageRequest) => {
  try {
    const transctions = await transactionRepository.list(pageRequest);
    return transctions;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchBookById = async (id: number) => {
  try {
    const book = await bookRepository.getById(id);
    return book;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchMemberById = async (id: number) => {
  try {
    const member = await memberRepository.getById(id);
    return member;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchGenre = async () => {
  // Fetch all books from the repository
  const allBooks = await bookRepository.list({
    limit: 999999, // Fetches a large number of books
    offset: 0,
    search: "", // No search term to fetch all books
  });

  // Extract genres from the books and filter for unique genres
  const uniqueGenres = Array.from(
    new Set(allBooks.items.map((book) => book.genre))
  );

  return uniqueGenres;
};

export const createMember = async (data: IMemberBase) => {
  try {
    const member = await memberRepository.create(data);
    return member;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const addBook = async (data: IBookBase) => {
  try {
    const books = await bookRepository.create(data);
    return books;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateBook = async (id: number, data: IBookBase) => {
  try {
    const books = await bookRepository.update(id, data);
    return books;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateMember = async (id: number, data: IMemberBase) => {
  try {
    const members = await memberRepository.update(id, data);
    return members;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteBook = async (isbnNo: string) => {
  try {
    const book = await bookRepository.getByISBN(isbnNo);
    await bookRepository.delete(book!.id);
    revalidatePath("/home/books");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateRequestStatus = async (data: IRequestBase) => {
  try {
    await requestRepository.create(data);
    revalidatePath("/home/books");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export async function fetchMyBooks(memberId: number): Promise<IBook[]> {
  const selectBooksByMember = await db
    .select()
    .from(Books)
    .innerJoin(Transactions, eq(Transactions.bookId, Books.id))
    .where(
      and(
        eq(Transactions.memberId, memberId),
        eq(Transactions.Status, "Issued")
      )
    );
  // Map the result to match the IBook interface if needed
  return selectBooksByMember.map((row) => ({
    id: row.books.id,
    title: row.books.title,
    author: row.books.author,
    publisher: row.books.publisher,
    genre: row.books.genre,
    isbnNo: row.books.isbnNo,
    numOfPages: row.books.numOfPages,
    totalNumOfCopies: row.books.totalNumOfCopies,
    availableNumberOfCopies: row.books.availableNumberOfCopies,
  }));
}

export async function booksRead(email: string) {
  const user = await memberRepository.getByEmail(email);
  const count = await transactionRepository.booksRead(user!.id);
  return count;
}

export async function CurrentlyReading(email: string) {
  const user = await memberRepository.getByEmail(email);
  const count = await transactionRepository.CurrentlyReading(user!.id);
  return count;
}

export async function fetchMyTransactions(
  memberId: number
): Promise<ITransaction[]> {
  const transactions = await transactionRepository.getMyTransactions(memberId);
  return transactions;
}

export async function returnBook(transactionId: number): Promise<void> {
  console.log("inside returnBook", transactionId);
  const transaction = await transactionRepository.getById(transactionId);
  console.log("inside returnBook",transaction);

  await transactionRepository.returnBook(transactionId, transaction!);
  revalidatePath("/home/transaction/mytransaction");
}
