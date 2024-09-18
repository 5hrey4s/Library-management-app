import { IPageRequest, IPagesResponse } from "@/core/pagination";
import { IRepository } from "@/core/repository";
import { asc, desc, eq, like, or } from "drizzle-orm/expressions";
import { CountResult } from "@/core/returnTypes";
import { IBook, IBookBase } from "@/Models/book-model";
import { SortOptions } from "@/lib/data";
import { Books } from "@/drizzle/schema";
import {VercelPgDatabase} from "drizzle-orm/vercel-postgres"
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
    const toBeUpdated = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined)
    );

    try {
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
        .where(like(Books.isbnNo, isbnNo));
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

    let sortOrder;
    let selectSql: IBook[];
    let countResult: CountResult;
    console.log(params,sortOptions);
    // Check for valid sorting options and set default if not provided
    if (sortOptions) {
      const sortBy = Books[sortOptions.sortBy] || Books.author; // Default to author if sortBy is invalid
      sortOrder = sortOptions.sortOrder === "desc" ? desc(sortBy) : asc(sortBy);
    } else {
      // Fallback to default sort
      sortOrder = asc(Books.title); // Default sort by title in ascending order
    }

    try {
      // Build the query with search, pagination, and sorting
      if (search) {
        selectSql = (await this.db
          .select()
          .from(Books)
          .where(
            or(
              like(Books.title, `%${search}%`),
              like(Books.isbnNo, `%${search}%`),
              like(Books.author, `%${search}%`),
              like(Books.genre, `%${search}%`)
            )
          )
          .limit(params.limit ?? 10) // Add a default limit
          .offset(params.offset ?? 0)
          .orderBy(sortOrder)) as IBook[];
      } else {
        selectSql = (await this.db
          .select()
          .from(Books)
          .limit(params.limit ?? 10) // Add a default limit
          .offset(params.offset ?? 0)
          .orderBy(sortOrder)) as IBook[];
      }
      
      // Get the count of books
      [countResult] = await this.db
        .select({ count: count() })
        .from(Books)
        .where(
          search
            ? or(
                like(Books.title, `%${search}%`),
                like(Books.isbnNo, `%${search}%`),
                like(Books.author, `%${search}%`),
                like(Books.genre, `%${search}%`)
              )
            : undefined
        );

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
