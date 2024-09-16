import z from "zod";

// Base interface for the request entity
export interface IRequestBase {
  bookId: number;
  memberId: number;
  status: string; // Status can be one of these two values
}

// Extended interface with additional fields like ID
export interface IRequest extends IRequestBase {
  id: number;
}

// Zod schema for validating request data
export const requestSchema = z.object({
  bookId: z
    .number()
    .int({ message: "Book ID must be an integer" })
    .min(1, { message: "Book ID must be at least 1" }), // Assuming IDs start from 1
  memberId: z
    .number()
    .int({ message: "Member ID must be an integer" })
    .min(1, { message: "Member ID must be at least 1" }), // Assuming IDs start from 1
  status: z.enum(["Accepted", "Requested"], {
    message: "Status must be either 'Accepted' or 'Requested'",
  }),
});
