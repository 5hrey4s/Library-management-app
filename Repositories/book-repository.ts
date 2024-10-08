import { IPageRequest, IPagesResponse } from "@/core/pagination";
import { IRepository } from "@/core/repository";
import { asc, desc, eq, ilike, or } from "drizzle-orm/expressions";
import { CountResult } from "@/core/returnTypes";
import { IBook, IBookBase } from "@/Models/book-model";
import { SortOptions } from "@/lib/data";
import { Books } from "@/drizzle/schema";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { count } from "drizzle-orm/sql";
export class BookRepository implements IRepository<IBookBase, IBook> {
  constructor(private db: VercelPgDatabase<Record<string, unknown>>) {}

  async create(data: IBookBase): Promise<IBook | null> {
    const bookData: Omit<IBook, "id"> = {
      ...data,
      availableNumberOfCopies: data.totalNumOfCopies,
    };
    try {
      // Insert the book data and return the 'id' column
      const [result] = await this.db
        .insert(Books)
        .values(bookData)
        .returning({ id: Books.id }); // Use returning() to return the inserted 'id'

      // Fetch the newly inserted book using the 'id'
      const [book]: IBook[] = await this.db
        .select()
        .from(Books)
        .where(eq(Books.id, result.id));

      return book;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, data: IBookBase): Promise<IBook | null> {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined)
    );

    try {
      const book = await this.getById(id);
      const toBeUpdated = {
        author: book?.author,
        availableNumberOfCopies: book?.availableNumberOfCopies,
        genre: book?.genre,
        image_url: book?.image_url,
        isbnNo: book?.isbnNo,
        numOfPages: book?.numOfPages,
        price: book?.price,
        publisher: book?.publisher,
        rating: book?.rating,
        title: book?.title,
        totalNumOfCopies: book?.availableNumberOfCopies,
        ...filteredData,
      };
      console.log(toBeUpdated);
      await this.db.update(Books).set(toBeUpdated).where(eq(Books.id, id));
      const [result]: IBook[] = await this.db
        .select()
        .from(Books)
        .where(eq(Books.id, id));

      if (Array.isArray(result) && result.length === 0) {
        return null;
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number): Promise<IBook | null> {
    try {
      await this.db.delete(Books).where(eq(Books.id, id));
      return null;
    } catch (err) {
      throw err;
    }
  }

  async getById(id: number): Promise<IBook | null> {
    try {
      const [result]: IBook[] = await this.db
        .select()
        .from(Books)
        .where(eq(Books.id, id));
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getByISBN(isbnNo: string): Promise<IBook> {
    try {
      const [result]: IBook[] = await this.db
        .select()
        .from(Books)
        .where(ilike(Books.isbnNo, isbnNo));
      return result;
    } catch (err) {
      throw err;
    }
  }

  async list(
    params: IPageRequest,
    sortOptions?: SortOptions
  ): Promise<IPagesResponse<IBook>> {
    let search = params.search ? params.search.toLowerCase() : "";
    console.log("====>", params, search);

    let sortOrder;
    let selectSql: IBook[];
    let countResult: CountResult;

    // Determine sorting options
    if (sortOptions) {
      const sortBy = Books[sortOptions.sortBy] || Books.author; // Default to author if sortBy is invalid
      sortOrder = sortOptions.sortOrder === "desc" ? desc(sortBy) : asc(sortBy);
    } else {
      // Fallback to default sort
      sortOrder = asc(Books.title); // Default sort by title in ascending order
    }

    try {
      // Build the base query
      const query = this.db.select().from(Books);

      // Apply search conditions if search term exists
      if (search) {
        query.where(
          or(
            ilike(Books.title, `%${search}%`),
            ilike(Books.isbnNo, `%${search}%`),
            ilike(Books.author, `%${search}%`),
            ilike(Books.genre, `%${search}%`)
          )
        );
      }

      // Apply pagination
      query.limit(params.limit ?? 10).offset(params.offset ?? 0);

      // Apply sorting
      query.orderBy(sortOrder);

      // Log the generated SQL query
      // console.log("Generated SQL Query:", query.toSQL());

      // Execute the query
      selectSql = (await query) as IBook[];
      // console.log(selectSql);2
      // Get the total count of books (with or without search)
      const countQuery = this.db.select({ count: count() }).from(Books);
      if (search) {
        countQuery.where(
          or(
            ilike(Books.title, `%${search}%`),
            ilike(Books.isbnNo, `%${search}%`),
            ilike(Books.author, `%${search}%`),
            ilike(Books.genre, `%${search}%`)
          )
        );
      }

      // Log the count query
      // console.log("Count SQL Query:", countQuery.toSQL());

      [countResult] = await countQuery;

      const countBook = (countResult as any).count;

      // Return the books with pagination
      return {
        items: selectSql,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: countBook,
        },
      };
    } catch (error) {
      console.log(error);
      throw new Error("Not found");
    }
  }

  async getTotalCount(): Promise<any> {
    let countResult;
    try {
      [countResult] = await this.db.select({ count: count() }).from(Books);

      const countBook = (countResult as any).count;
      return countBook;
    } catch (err) {
      throw err;
    }
  }
}
