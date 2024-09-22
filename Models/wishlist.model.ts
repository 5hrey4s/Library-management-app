import z from "zod";

// Define the base interface for wishlist input
export interface IWishlistBase {
  bookId: number;
  memberId: number;
}

// Define the complete wishlist interface (includes id)
export interface IWishlist extends IWishlistBase {
  id: number;
}

// Define the Zod schema for validation
export const wishlistSchema = z.object({
  bookId: z
    .number()
    .int({ message: "Book ID must be an integer" })
    .min(1, { message: "Book ID must be at least 1" }),
  memberId: z
    .number()
    .int({ message: "Member ID must be an integer" })
    .min(1, { message: "Member ID must be at least 1" }),
});
