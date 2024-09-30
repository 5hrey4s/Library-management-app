import { IPageRequest, IPagesResponse } from "@/core/pagination";
import { IRepository } from "@/core/repository";
import { asc, desc, eq, ilike, or } from "drizzle-orm/expressions";
import { CountResult } from "@/core/returnTypes";
import { PaymentSortOptions, SortOptions } from "@/lib/data";
import { Payments } from "@/drizzle/schema"; // Ensure you have the correct path
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { count } from "drizzle-orm/sql";
import { IPayment, IPaymentBase } from "@/Models/payments.model";
import { formatDate } from "@/core/formatdate";

export class PaymentRepository implements IRepository<IPaymentBase, IPayment> {
  constructor(private db: VercelPgDatabase<Record<string, unknown>>) {}

  async create(data: IPaymentBase): Promise<IPayment | null> {
    const paymentData: Omit<IPayment, "id"> = {
      ...data,
      createdAt: formatDate(new Date()), // Set createdAt to the current date
    };
    
    try {
      // Insert the payment data and return the 'id' column
      const [result] = await this.db
        .insert(Payments)
        .values(paymentData)
        .returning({ id: Payments.id }); // Use returning() to return the inserted 'id'

      // Fetch the newly inserted payment using the 'id'
      const [payment]: IPayment[] = await this.db
        .select()
        .from(Payments)
        .where(eq(Payments.id, result.id));

      return payment;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, data: IPaymentBase): Promise<IPayment | null> {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined)
    );

    try {
      const payment = await this.getById(id);
      if (!payment) {
        return null; // Payment not found
      }

      const toBeUpdated = {
        ...payment,
        ...filteredData,
      };

      await this.db.update(Payments).set(toBeUpdated).where(eq(Payments.id, id));
      const [result]: IPayment[] = await this.db
        .select()
        .from(Payments)
        .where(eq(Payments.id, id));

      return result ?? null; // Return updated payment or null if not found
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number): Promise<IPayment | null> {
    try {
      const payment = await this.getById(id);
      if (!payment) {
        return null; // Payment not found
      }

      await this.db.delete(Payments).where(eq(Payments.id, id));
      return payment; // Return the deleted payment
    } catch (err) {
      throw err;
    }
  }

  async getById(id: number): Promise<IPayment | null> {
    try {
      const [result]: IPayment[] = await this.db
        .select()
        .from(Payments)
        .where(eq(Payments.id, id));
      return result ?? null; // Return found payment or null
    } catch (err) {
      throw err;
    }
  }

  async getByOrderId(orderId: string): Promise<IPayment | null> {
    try {
      const [result]: IPayment[] = await this.db
        .select()
        .from(Payments)
        .where(eq(Payments.orderId, orderId));
      return result ?? null; // Return found payment or null
    } catch (err) {
      throw err;
    }
  }

  async list(
    params: IPageRequest,
    sortOptions?: PaymentSortOptions
  ): Promise<IPagesResponse<IPayment>> {
    let search = params.search ? params.search.toLowerCase() : "";

    let sortOrder;
    let selectSql: IPayment[] = [];
    let countResult: CountResult;

    // Determine sorting options
    if (sortOptions) {
      const sortBy = Payments[sortOptions.sortBy] || Payments.createdAt; // Default to createdAt if sortBy is invalid
      sortOrder = sortOptions.sortOrder === "desc" ? desc(sortBy) : asc(sortBy);
    } else {
      // Fallback to default sort
      sortOrder = asc(Payments.createdAt); // Default sort by createdAt in ascending order
    }

    try {
      // Build the base query
      const query = this.db.select().from(Payments);

      // Apply search conditions if search term exists
      if (search) {
        query.where(
          or(
            ilike(Payments.orderId, `%${search}%`),
            ilike(Payments.paymentStatus, `%${search}%`)
          )
        );
      }

      // Apply pagination
      query.limit(params.limit ?? 10).offset(params.offset ?? 0);

      // Apply sorting
      query.orderBy(sortOrder);

      // Execute the query
      selectSql = (await query) as IPayment[];

      // Get the total count of payments (with or without search)
      const countQuery = this.db.select({ count: count() }).from(Payments);
      if (search) {
        countQuery.where(
          or(
            ilike(Payments.orderId, `%${search}%`),
            ilike(Payments.paymentStatus, `%${search}%`)
          )
        );
      }

      [countResult] = await countQuery;
      const countPayment = (countResult as any).count;

      // Return the payments with pagination
      return {
        items: selectSql,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: countPayment,
        },
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to retrieve payments");
    }
  }

  async getTotalCount(): Promise<number> {
    try {
      const [countResult] = await this.db.select({ count: count() }).from(Payments);
      return (countResult as any).count; // Return total count
    } catch (err) {
      throw err;
    }
  }
}
