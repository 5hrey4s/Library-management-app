import { IPageRequest, IPagesResponse } from "@/core/pagination";
import { IRepository } from "@/core/repository";
import { Requests } from "@/drizzle/schema"; // Make sure the Requests schema is correctly defined
import { MySql2Database } from "drizzle-orm/mysql2";
import { count, eq, like, or } from "drizzle-orm";
import { CountResult } from "@/core/returnTypes";
import { IRequest, IRequestBase } from "@/Models/request.model";
import { error } from "@material-tailwind/react/types/components/input";

export class RequestRepository implements IRepository<IRequestBase, IRequest> {
  constructor(private db: MySql2Database<Record<string, never>>) {}

  async create(data: IRequestBase): Promise<IRequest | null> {
    try {
      const [result] = await this.db
        .insert(Requests)
        .values(data)
        .$returningId();

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
      await this.db
        .update(Requests)
        .set(data)
        .where(eq(Requests.id, id));
        console.log("data=====",id)
        
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
    let selectSql: IRequest[];
    let countResult: CountResult;

    try {
      // Building the query based on search and pagination parameters
      if (search) {
        selectSql = await this.db
          .select()
          .from(Requests)
          .where(
            or(
              like(Requests.bookId, `%${search}%`),
              like(Requests.memberId, `%${search}%`),
              like(Requests.status, `%${search}%`)
            )
          )
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      } else {
        selectSql = await this.db
          .select()
          .from(Requests)
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      }

      [countResult] = await this.db
        .select({ count: count() })
        .from(Requests)
        .where(
          search
            ? or(
                like(Requests.bookId, search),
                like(Requests.memberId, search),
                like(Requests.status, search)
              )
            : undefined
        );

      const countRequest = (countResult as any).count;
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
