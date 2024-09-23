import { IRepository } from "@/core/repository";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { Ratings } from "@/drizzle/schema";
import { eq } from "drizzle-orm/expressions";
import { IRating, IRatingBase } from "@/Models/rating.models";
import { IPageRequest, IPagesResponse } from "@/core/pagination";
import {
  SortOptions,
  MemberSortOptions,
  TransactionSortOptions,
} from "@/lib/data";

export class RatingsRepository implements IRepository<IRatingBase, IRating> {
  constructor(private db: VercelPgDatabase<Record<string, unknown>>) {}
  getById(id: number): Promise<IRating | null> {
    throw new Error("Method not implemented.");
  }
  list(
    params: IPageRequest,
    sortOptions?: SortOptions | MemberSortOptions | TransactionSortOptions
  ): Promise<IPagesResponse<IRating>> {
    throw new Error("Method not implemented.");
  }

  async create(data: IRatingBase): Promise<IRating | null> {
    try {
      const [result] = await this.db
        .insert(Ratings)
        .values(data)
        .returning({ id: Ratings.id });
      const [rating]: IRating[] = await this.db
        .select()
        .from(Ratings)
        .where(eq(Ratings.id, result.id));

      return rating;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, data: Partial<IRating>): Promise<IRating | null> {
    try {
      await this.db.update(Ratings).set(data).where(eq(Ratings.id, id));
      const [result] = await this.db
        .select()
        .from(Ratings)
        .where(eq(Ratings.id, id));

      return result;
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number): Promise<IRating | null> {
    try {
      await this.db.delete(Ratings).where(eq(Ratings.id, id));
      return null;
    } catch (err) {
      throw err;
    }
  }

  async getByBookId(bookId: number): Promise<IRating[]> {
    try {
      const result = await this.db
        .select()
        .from(Ratings)
        .where(eq(Ratings.bookId, bookId));

      return result;
    } catch (err) {
      throw err;
    }
  }
  async getMeanRatingByBookId(bookId: number): Promise<number | null> {
    try {
      // Fetch all ratings for the given bookId
      const ratings: { rating: number }[] = await this.db
        .select({ rating: Ratings.rating }) // Select only the rating column
        .from(Ratings)
        .where(eq(Ratings.bookId, bookId));

      // Check if there are any ratings
      if (ratings.length === 0) {
        return null; // Return null if no ratings are found
      }

      // Calculate the mean of the ratings
      const totalRating = ratings.reduce(
        (sum, current) => sum + current.rating,
        0
      );
      const meanRating = totalRating / ratings.length;

      return meanRating;
    } catch (err) {
      throw err;
    }
  }
}
