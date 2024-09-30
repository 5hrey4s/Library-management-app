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
import { number } from "zod";

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
  image_url: varchar("image_url", { length: 255 }).notNull(),
  price: integer("price").notNull(),
  rating: integer("rating").notNull(),
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
  Status: varchar("Status", { length: 100 }).notNull(),
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

// Ratings Table - New addition
export const Ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  bookId: integer("bookId")
    .references(() => Books.id)
    .notNull(),
  memberId: integer("memberId")
    .references(() => Members.id)
    .notNull(),
  rating: integer("rating").notNull(), // Rating value 1-5
  review: text("review").notNull(), // Optional review text
  created_at: varchar("created_at", { length: 100 }).notNull(),
});

// Wishlist Table - New addition
export const Wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  bookId: integer("bookId")
    .references(() => Books.id)
    .notNull(),
  memberId: integer("memberId")
    .references(() => Members.id)
    .notNull(),
  addedAt: varchar("addedAt", { length: 100 }),
});

export const Professors = pgTable("professors", {
  id: serial("id").primaryKey(), // Unique professor identifier
  name: varchar("name", { length: 100 }).notNull(), // Full name of the professor
  department: varchar("department", { length: 100 }).notNull(), // Professor's department
  bio: text("bio").notNull(), // A short biography
  calendlyLink: varchar("calendlyLink", { length: 255 }).notNull(), // Calendly link for scheduling appointments
  email: varchar("email", { length: 100 }).unique().notNull(), // Unique professor email for identification
  googleMeetEnabled: varchar("googleMeetEnabled", { length: 10 })
    .default("true")
    .notNull(), // Flag to check if Google Meet is enabled
});

export const Appointments = pgTable("appointments", {
  id: serial("id").primaryKey(), // Unique appointment ID
  professorId: integer("professorId")
    .references(() => Professors.id)
    .notNull(), // Link to the professor's profile
  userId: varchar("userId", { length: 255 }).notNull(), // The user's ID who booked the appointment
  appointmentDate: varchar("appointmentDate", { length: 100 }).notNull(), // Date of the appointment
  googleMeetLink: varchar("googleMeetLink", { length: 255 }), // Google Meet link for the appointment
  calendlyLink: varchar("calendlyLink", { length: 255 }).notNull(), // The Calendly link used for scheduling
  createdAt: varchar("createdAt", { length: 100 }).notNull(), // When the appointment was created
});

// Payments Table with Razorpay details
export const Payments = pgTable("payments", {
  id: serial("id").primaryKey(), // Unique payment ID
  professorId: integer("professorId")
    .references(() => Professors.id)
    .notNull(), // Link to the professor's profile
  userId: integer("userId") // Foreign key reference to Members table
    .references(() => Members.id)
    .notNull(), // The ID of the user making the payment
  orderId: varchar("orderId", { length: 255 }).unique().notNull(), // Unique order identifier (razorpay_order_id)
  amount: integer("amount").notNull(), // Payment amount in the smallest unit of currency (e.g., cents)
  paymentStatus: varchar("paymentStatus", { length: 50 }).notNull(), // Payment status (e.g., "Pending", "Completed", "Failed")
  PaymentId: varchar("PaymentId", { length: 255 }).unique().notNull(), // Razorpay payment ID (razorpay_payment_id)
  createdAt: varchar("createdAt", { length: 100 }).notNull(), // When the payment was created
});
