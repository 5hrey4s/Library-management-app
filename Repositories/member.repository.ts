import { IPageRequest, IPagesResponse } from "../core/pagination";
import { IRepository } from "../core/repository";
import { MySql2Database } from "drizzle-orm/mysql2";
import { Members } from "@/drizzle/schema";
import { count, eq, like, or } from "drizzle-orm";
import { CountResult } from "@/core/returnTypes";
import { IMember, IMemberBase } from "@/Models/member.model";

export class MemberRepository implements IRepository<IMemberBase, IMember> {
  constructor(private db: MySql2Database<Record<string, never>>) {}
  async create(data: IMemberBase): Promise<IMember | null> {
    try {
      const [result] = await this.db
        .insert(Members)
        .values({
          ...data,
        })
        .$returningId();
      const [member]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.id, result.id));
      return member;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, data: any): Promise<IMember | null> {
    const toBeUpdated = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => value !== undefined || value !== ""
      )
    );

    try {
      // console.log((data))
      await this.db.update(Members).set(toBeUpdated).where(eq(Members.id, id));
      const [result]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.id, id));

      if (Array.isArray(result) && result.length === 0) {
        return null;
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number): Promise<IMember | null> {
    try {
      await this.db.delete(Members).where(eq(Members.id, id));
      return null;
    } catch (err) {
      throw err;
    }
  }
  async getById(id: number): Promise<IMember | null> {
    try {
      const [result]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.id, id));
      return result;
    } catch (err) {
      throw err;
    }
  }
  async getByUserId(user_id: string): Promise<IMember | null> {
    try {
      const [result]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.user_id, user_id));
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getByUserName(name: string) {
    try {
      const [result]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.firstName, name));
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getByEmail(email: string): Promise<IMember | null> {
    try {
      const [result]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.email, email));
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getByRefreshToken(refreshToken: string): Promise<IMember | null> {
    try {
      const [result]: IMember[] = await this.db
        .select()
        .from(Members)
        .where(eq(Members.refreshToken, refreshToken));
      return result;
    } catch (err) {
      throw err;
    }
  }
  async list(params: IPageRequest): Promise<IPagesResponse<IMember>> {
    const search = params.search?.toLocaleLowerCase();
    let selectSql: IMember[];
    let countResult: CountResult;

    try {
      // Building the query based on search and pagination parameters
      if (search) {
        selectSql = await this.db
          .select()
          .from(Members)
          .where(
            or(
              like(Members.email,  `%${search}%`),
              like(Members.lastName,  `%${search}%`),
              like(Members.firstName,  `%${search}%`)
            )
          )
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      } else {
        selectSql = await this.db
          .select()
          .from(Members)
          .limit(params.limit ?? 0)
          .offset(params.offset ?? 0);
      }

      // Counting the total number of results
      [countResult] = await this.db
        .select({ count: count() })
        .from(Members)
        .where(
          search
            ? or(
                like(Members.email, search),
                like(Members.lastName, search),
                like(Members.firstName, search)
              )
            : undefined
        );

      const countBook = (countResult as any).count;

      // Return the results and pagination information
      return {
        items: selectSql,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total: countBook,
        },
      };
    } catch (error) {
      throw new Error("Not found");
    }
  }

  async getTotalCount(): Promise<any> {
    let countResult;
    try {
      [countResult] = await this.db.select({ count: count() }).from(Members);

      const countMember = (countResult as any).count;
      return countMember;
    } catch (err) {
      throw err;
    }
  }
}
