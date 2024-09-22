import { IRepository } from "@/core/repository";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { Wishlist } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm/expressions";
import { IWishlist, IWishlistBase } from "@/Models/wishlist.model";
import { IPageRequest, IPagesResponse } from "@/core/pagination";

import {
  SortOptions,
  MemberSortOptions,
  TransactionSortOptions,
} from "@/lib/data";

export class WishlistRepository
  implements IRepository<IWishlistBase, IWishlist>
{
  constructor(private db: VercelPgDatabase<Record<string, unknown>>) {}
  update(id: number, data: IWishlistBase): Promise<IWishlist | null> {
    throw new Error("Method not implemented.");
  }
  getById(id: number): Promise<IWishlist | null> {
    throw new Error("Method not implemented.");
  }
  list(
    params: IPageRequest,
    sortOptions?: SortOptions | MemberSortOptions | TransactionSortOptions
  ): Promise<IPagesResponse<IWishlist>> {
    throw new Error("Method not implemented.");
  }

  async create(data: IWishlistBase): Promise<IWishlist | null> {
    try {
      const [result] = await this.db
        .insert(Wishlist)
        .values(data)
        .returning({ id: Wishlist.id });
      const [wishlist]: IWishlist[] = await this.db
        .select()
        .from(Wishlist)
        .where(eq(Wishlist.id, result.id));
      return wishlist;
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number): Promise<IWishlist | null> {
    try {
      await this.db.delete(Wishlist).where(eq(Wishlist.id, id));
      return null;
    } catch (err) {
      throw err;
    }
  }

  async removeWishList(
    bookId: number,
    memberId: number
  ): Promise<IWishlist | null> {
    try {
      const [wishList] = await this.db
        .select()
        .from(Wishlist)
        .where(
          and(eq(Wishlist.bookId, bookId), eq(Wishlist.memberId, memberId))
        );
      await this.db.delete(Wishlist).where(eq(Wishlist.id, wishList.id));
      return null;
    } catch (err) {
      throw err;
    }
  }

  async getByMemberId(memberId: number): Promise<
    {
      bookId: number;
    }[]
  > {
    try {
      const result = await this.db
        .select({ bookId: Wishlist.bookId })
        .from(Wishlist)
        .where(eq(Wishlist.memberId, memberId));

      return result;
    } catch (err) {
      throw err;
    }
  }

  async hasUserLikedBook(bookId: number, userId: number): Promise<boolean> {
    try {
      const result = await this.db
        .select()
        .from(Wishlist)
        .where(and(eq(Wishlist.bookId, bookId), eq(Wishlist.memberId, userId)))
        .limit(1); // Only need to check for existence

      return result.length > 0; // Returns true if a record exists
    } catch (error) {
      console.error("Error checking if user liked the book:", error);
      throw new Error("Could not determine if the user liked the book.");
    }
  }
}
