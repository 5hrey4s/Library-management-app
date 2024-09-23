import z from "zod";

// Define the base interface for rating input
export interface IRatingBase {
  bookId: number;
  memberId: number;
  rating: number;
  review: string;
}

// Define the complete rating interface (includes id)
export interface IRating extends IRatingBase {
  id: number;
  created_at: string;
}

// Define the Zod schema for validation
export const ratingSchema = z.object({
  bookId: z
    .number()
    .int({ message: "Book ID must be an integer" })
    .min(1, { message: "Book ID must be at least 1" }),
  memberId: z
    .number()
    .int({ message: "Member ID must be an integer" })
    .min(1, { message: "Member ID must be at least 1" }),
  rating: z
    .number()
    .int({ message: "Rating must be an integer" })
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating cannot exceed 5" }), // Assuming rating is between 1 and 5
  review: z
    .string()
    .min(1, { message: "Review is required" })
    .max(1000, { message: "Review must be less than 1000 characters" }),
});
