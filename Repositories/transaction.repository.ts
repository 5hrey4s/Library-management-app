import { formatDate } from "../core/formatdate";
import { IPageRequest, IPagesResponse } from "../core/pagination";
import { IRepository } from "../core/repository";
import { MySql2Database } from "drizzle-orm/mysql2";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { asc, desc, eq, like, or } from "drizzle-orm/expressions";
import { error } from "node:console";
import { ITransaction, ITransactionBase } from "@/Models/transaction.model";
import { Books, Transactions } from "@/drizzle/schema";
import { CountResult } from "@/core/returnTypes";
import { TransactionSortOptions } from "@/lib/data";
import { count } from "drizzle-orm/sql";
import { and } from "drizzle-orm/expressions";

export class TransactionRepository
  implements IRepository<ITransactionBase, ITransaction>
{
  async getAllTransactions() {
    const transactions: ITransaction[] = await this.db
      .select()
      .from(Transactions);
    return transactions;
  }
  async getTotalCount() {
    let countResult;
    [countResult] = await this.db.select({ count: count() }).from(Transactions);
    return countResult.count;
  }
  constructor(private db: VercelPgDatabase<Record<string, unknown>>) {}

  async create(data: ITransactionBase): Promise<ITransaction | null> {
    const currentDate = new Date();
    const dueDays = 7;
    const dueDate = new Date(currentDate);
    dueDate.setDate(currentDate.getDate() + dueDays);
    const transaction: Omit<ITransaction, "id"> = {
      bookId: data.bookId,
      memberId: data.memberId,
      issueDate: formatDate(currentDate),
      dueDate: formatDate(dueDate),
      returnDate: null,
      Status: "Issued",
    };
    const createdTransaction: ITransaction | undefined =
      await this.db.transaction(async (trx) => {
        try {
          const [result] = await trx
            .insert(Transactions)
            .values(transaction)
            .returning({ id: Transactions.id });
          const [createdTransaction] = await trx
            .select()
            .from(Transactions)
            .where(eq(Transactions.id, result.id));
          const [book] = await trx
            .select()
            .from(Books)
            .where(eq(Books.id, transaction.bookId));
          if (transaction.Status === "Issued" && book) {
            await trx
              .update(Books)
              .set({
                availableNumberOfCopies: book.availableNumberOfCopies - 1,
              })
              .where(eq(Books.id, transaction.bookId));
            return createdTransaction;
          }
        } catch (err) {
          throw err;
        }
      });
    return createdTransaction!;
  }

  async update(id: number, data: ITransaction): Promise<ITransaction | null> {
    // const newTransaction = await this.db.transaction(async (trx) => {
    //   const [book] = await this.db
    //     .select()
    //     .from(Books)
    //     .where(eq(Books.id, transaction.bookId));
    //   await this.db
    //     .update(Books)
    //     .set({ availableNumberOfCopies: book.availableNumberOfCopies + 1 });
    //   await this.db
    //     .update(Transactions)
    //     .set({ returnDate: formatDate(new Date()), Status: "Returned" });

    //   return transaction as ITransaction;
    // });
    // return newTransaction;
    throw error;
  }

  async handleBookRequest(
    status: string,
    data?: ITransactionBase,
    id?: number
  ) {
    try {
      if (status == "")
        if (!id && data) {
          const currentDate = new Date();
          const dueDays = 7;
          const dueDate = new Date(currentDate);
          dueDate.setDate(currentDate.getDate() + dueDays);
          const transaction: Omit<ITransaction, "id"> = {
            bookId: data.bookId,
            memberId: data.memberId,
            issueDate: formatDate(currentDate),
            dueDate: formatDate(dueDate),
            returnDate: null,
            Status: status,
          };
          const [result] = await this.db
            .insert(Transactions)
            .values(transaction)
            .returning({ id: Transactions.id });
        } else {
          this.db
            .update(Transactions)
            .set({ Status: status })
            .where(eq(Transactions.id, id!));
        }
    } catch (err) {
      throw err;
    }
  }

  async handleReject(id: number) {
    try {
      this.db
        .update(Transactions)
        .set({ Status: "Rejected" })
        .where(eq(Transactions.id, id));
      const [createdTransaction] = await this.db
        .select()
        .from(Transactions)
        .where(eq(Transactions.id, id));
      return createdTransaction;
    } catch (err) {
      throw err;
    }
  }

  async returnBook(
    id: number,
    transaction: ITransaction
  ): Promise<ITransaction | null> {
    const newTransaction = await this.db.transaction(async (trx) => {
      console.log("inside returnBook", transaction);

      const [book] = await this.db
        .select()
        .from(Books)
        .where(eq(Books.id, transaction.bookId));
      await this.db
        .update(Books)
        .set({ availableNumberOfCopies: book.availableNumberOfCopies + 1 });
      await this.db
        .update(Transactions)
        .set({ returnDate: formatDate(new Date()), Status: "Returned" })
        .where(eq(Transactions.id, id));

      return transaction as ITransaction;
    });
    return newTransaction;
  }

  async getById(id: number): Promise<ITransaction | null> {
    const [transaction]: ITransaction[] = await this.db
      .select()
      .from(Transactions)
      .where(eq(Transactions.id, id));
    return transaction;
  }

  async booksRead(memberId: number): Promise<number> {
    const result = await this.db
      .select({ count: count() })
      .from(Transactions)
      .where(
        and(
          eq(Transactions.memberId, memberId),
          eq(Transactions.Status, "Returned")
        )
      );

    return result[0].count;
  }

  async CurrentlyReading(memberId: number): Promise<number> {
    const result = await this.db
      .select({ count: count() })
      .from(Transactions)
      .where(
        and(
          eq(Transactions.memberId, memberId),
          eq(Transactions.Status, "Issued")
        )
      );

    return result[0].count;
  }

  async list(
    params: IPageRequest,
    sortOptions?: TransactionSortOptions
  ): Promise<IPagesResponse<ITransaction>> {
    let search = params.search ? params.search.toLowerCase() : "";

    let sortOrder;
    let selectSql: ITransaction[];
    let countResult: CountResult;

    // Check for valid sorting options and set default if not provided
    if (sortOptions) {
      const sortBy = Transactions[sortOptions.sortBy] || Transactions.issueDate; // Default to author if sortBy is invalid
      sortOrder = sortOptions.sortOrder === "desc" ? desc(sortBy) : asc(sortBy);
    } else {
      // Fallback to default sort
      sortOrder = asc(Transactions.issueDate); // Default sort by title in ascending order
    }

    try {
      // Build the query with search, pagination, and sorting
      if (search) {
        selectSql = (await this.db
          .select()
          .from(Transactions)
          .where(
            or(
              like(Transactions.bookId, `%${search}%`),
              like(Transactions.memberId, `%${search}%`),
              like(Transactions.Status, `%${search}%`)
            )
          )
          .limit(params.limit ?? 10) // Add a default limit
          .offset(params.offset ?? 0)
          .orderBy(sortOrder)) as ITransaction[];
      } else {
        selectSql = (await this.db
          .select()
          .from(Transactions)
          .limit(params.limit ?? 10) // Add a default limit
          .offset(params.offset ?? 0)
          .orderBy(sortOrder)) as ITransaction[];
      }

      // Get the count of books
      [countResult] = await this.db
        .select({ count: count() })
        .from(Transactions)
        .where(
          search
            ? or(
                like(Transactions.bookId, `%${search}%`),
                like(Transactions.memberId, `%${search}%`),
                like(Transactions.Status, `%${search}%`)
              )
            : undefined
        );

      const countMember = (countResult as any).count;

      // Return the books with pagination
      return {
        items: selectSql,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: countMember,
        },
      };
    } catch (error) {
      console.log(error);
      throw new Error("Not found");
    }
  }

  async listMyTransactions(
    params: IPageRequest
  ): Promise<IPagesResponse<ITransaction>> {
    const search = params.search?.toLocaleLowerCase();
    let selectSql: ITransaction[];
    let countResult: CountResult;

    try {
      if (search) {
        selectSql = await this.db
          .select()
          .from(Transactions)
          .where(
            or(
              like(Transactions.bookId, `%${search}%`),
              like(Transactions.memberId, `%${search}%`),
              like(Transactions.Status, `%${search}%`)
            )
          )
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      } else {
        selectSql = await this.db
          .select()
          .from(Transactions)
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      }

      [countResult] = await this.db
        .select({ count: count() })
        .from(Transactions)
        .where(
          search
            ? or(
                like(Transactions.memberId, search),
                like(Transactions.bookId, search)
              )
            : undefined
        );

      const countTransaction = (countResult as any).count;

      return {
        items: selectSql,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: countTransaction,
        },
      };
    } catch (error) {
      throw new Error("Not found");
    }
  }
  async getMyTransactions(memberId: number): Promise<ITransaction[]> {
    const transactions: ITransaction[] = await this.db
      .select()
      .from(Transactions)
      .where(eq(Transactions.memberId, memberId));

    return transactions || null; // Return null if no transaction is found
  }
  async delete(id: number): Promise<ITransaction | null> {
    return null;
  }
}
