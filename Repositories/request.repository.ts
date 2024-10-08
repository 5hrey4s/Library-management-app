import { IPageRequest, IPagesResponse } from "@/core/pagination";
import { IRepository } from "@/core/repository";
import { Requests } from "@/drizzle/schema"; // Make sure the Requests schema is correctly defined
import { MySql2Database } from "drizzle-orm/mysql2";
import { asc, desc, eq, ilike, or } from "drizzle-orm/expressions";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { CountResult } from "@/core/returnTypes";
import { IRequest, IRequestBase } from "@/Models/request.model";
import { count } from "drizzle-orm/sql";

export class RequestRepository implements IRepository<IRequestBase, IRequest> {
  constructor(private db: VercelPgDatabase<Record<string, unknown>>) {}

  async create(data: IRequestBase): Promise<IRequest | null> {
    try {
      const [result] = await this.db
        .insert(Requests)
        .values(data)
        .returning({ id: Requests.id });

      const [request] = await this.db
        .select()
        .from(Requests)
        .where(eq(Requests.id, result.id));
      return request;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, data: any): Promise<IRequest | null> {
    console.log(id);
    try {
      await this.db.update(Requests).set(data).where(eq(Requests.id, id));
      console.log("data=====", id);

      const [result]: IRequest[] = await this.db
        .select()
        .from(Requests)
        .where(eq(Requests.id, id));

      if (Array.isArray(result) && result.length === 0) {
        return null;
      }
      return data;
    } catch (err) {
      console.log((err as Error).message);
      throw err;
    }
  }

  async delete(id: number): Promise<IRequest | null> {
    try {
      await this.db.delete(Requests).where(eq(Requests.id, id));
      return null;
    } catch (err) {
      throw err;
    }
  }

  async getById(id: number): Promise<IRequest | null> {
    try {
      const [result]: IRequest[] = await this.db
        .select()
        .from(Requests)
        .where(eq(Requests.id, id));
      return result;
    } catch (err) {
      throw err;
    }
  }

  async list(params: IPageRequest): Promise<IPagesResponse<IRequest>> {
    let search;
    if (params.search) {
      search = params.search?.toLocaleLowerCase();
    } else {
      search = "";
    }
    console.log(params);
    let selectSql: IRequest[];
    let countResult: CountResult;

    try {
      if (search) {
        selectSql = await this.db
          .select()
          .from(Requests)
          .where(eq(Requests.status, "Pending"))
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      } else {
        selectSql = await this.db
          .select()
          .from(Requests)
          .limit(params.limit ?? 0)
          .where(eq(Requests.status, "Pending"))
          .offset(params.offset ?? 0);
      }

      [countResult] = await this.db
        .select({ count: count() })
        .from(Requests)
        .where(
          search
            ? or(
                ilike(Requests.bookId, search),
                ilike(Requests.memberId, search),
                ilike(Requests.status, search)
              )
            : undefined
        );

      const countRequest = (countResult as any).count;
      console.log(countResult, selectSql);
      return {
        items: selectSql,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: countRequest,
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
      [countResult] = await this.db.select({ count: count() }).from(Requests);

      const countRequest = (countResult as any).count;
      return countRequest;
    } catch (err) {
      throw err;
    }
  }
}
