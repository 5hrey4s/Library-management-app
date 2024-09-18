import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import {
  pgTable,
  serial,
  text,
  integer,
  varchar,
  timestamp,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";

// Define the enum
const transactionStatusEnum = pgEnum("Status", ["Issued", "Returned"]);

// Books Table
export const Books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  publisher: varchar("publisher", { length: 100 }).notNull(),
  genre: varchar("genre", { length: 100 }).notNull(),
  isbnNo: varchar("isbnNo", { length: 13 }).unique().notNull(),
  numOfPages: integer("numOfPages").notNull(),
  totalNumOfCopies: integer("totalNumOfCopies").notNull(),
  availableNumberOfCopies: integer("availableNumberOfCopies").notNull(),
});

// Members Table
export const Members = pgTable("members", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  phoneNumber: varchar("phoneNumber", { length: 10 }).notNull(),
  password: varchar("password", { length: 150 }).notNull(),
  refreshToken: varchar("refreshToken", { length: 255 }),
  accessToken: varchar("accessToken", { length: 255 }),
  user_id: varchar("user_id", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
});

// Transactions Table
export const Transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  bookId: integer("bookId")
    .references(() => Books.id)
    .notNull(),
  memberId: integer("memberId")
    .references(() => Members.id)
    .notNull(),
  issueDate: varchar("issueDate", { length: 100 }).notNull(),
  dueDate: varchar("dueDate", { length: 100 }).notNull(),
  returnDate: varchar("returnDate", { length: 100 }),
  Status: transactionStatusEnum("Status").notNull(),
});

// Requests Table
export const Requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  bookId: integer("bookId")
    .references(() => Books.id)
    .notNull(),
  memberId: integer("memberId")
    .references(() => Members.id)
    .notNull(),
  status: varchar("status", { length: 50 }).notNull(),
});
