"use server";
import { IPageRequest, IPagesResponse } from "@/core/pagination";
import { Books, Transactions } from "@/drizzle/schema";
import { IBook, IBookBase } from "@/Models/book-model";
import { IMemberBase } from "@/Models/member.model";
import { IRequestBase } from "@/Models/request.model";
import { BookRepository } from "@/Repositories/book-repository";
import { MemberRepository } from "@/Repositories/member.repository";
import { RequestRepository } from "@/Repositories/request.repository";
import { revalidatePath } from "next/cache";
import { asc, desc, eq, like, or } from "drizzle-orm/expressions";
import { TransactionRepository } from "@/Repositories/transaction.repository";
import "@/drizzle/envConfig";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "../drizzle/schema";
import { and } from "drizzle-orm/expressions";
import { ITransaction, ITransactionBase } from "@/Models/transaction.model";
import { IProfessorBase } from "@/Models/professor.model";
import { IPaymentBase } from "@/Models/payments.model";

const db = drizzle(sql, { schema });

const bookRepository = new BookRepository(db);
const memberRepository = new MemberRepository(db);
const requestRepository = new RequestRepository(db);
const transactionRepository = new TransactionRepository(db);

export interface SortOptions {
  sortBy: keyof IBookBase;
  sortOrder: string;
}

export interface MemberSortOptions {
  sortBy: keyof IMemberBase;
  sortOrder: string;
}

export interface TransactionSortOptions {
  sortBy: keyof ITransactionBase;
  sortOrder: string;
}

export interface TransactionSortOptions {
  sortBy: keyof ITransactionBase;
  sortOrder: string;
}

export interface PaymentSortOptions {
  sortBy: keyof IPaymentBase;
  sortOrder: string;
}
export const fetchBooks = async (
  pageRequest: IPageRequest,
  sortOptions: SortOptions
) => {
  try {
    console.log(pageRequest);
    const books = await bookRepository.list(pageRequest, sortOptions);
    return books;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchMembers = async (
  pageRequest: IPageRequest,
  sortOptions: MemberSortOptions
) => {
  try {
    const members = await memberRepository.list(pageRequest, sortOptions);
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

export const fetchTransaction = async (
  pageRequest: IPageRequest,
  sortOptions: TransactionSortOptions
) => {
  try {
    const transctions = await transactionRepository.list(
      pageRequest,
      sortOptions
    );
    return transctions;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchBookById = async (id: number) => {
  try {
    const book = await bookRepository.getById(id);
    return book!;
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

export const updateRequestStatus = async (data: ITransactionBase) => {
  console.log("inside data");
  try {
    await transactionRepository.handleBookRequest("Pending", data);
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
    image_url: row.books.image_url,
    price: row.books.price,
    rating: row.books.rating,
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

export async function listMyTransactions(
  pageRequest: IPageRequest
): Promise<IPagesResponse<ITransaction>> {
  const items = await transactionRepository.listMyTransactions(pageRequest);
  return items;
}

export async function returnBook(transactionId: number): Promise<void> {
  console.log("inside returnBook", transactionId);
  const transaction = await transactionRepository.getById(transactionId);
  console.log("inside returnBook", transaction);

  await transactionRepository.returnBook(transactionId, transaction!);
  revalidatePath("/home/mytransaction");
}
