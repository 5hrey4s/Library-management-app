import { IPageRequest, IPagesResponse } from "../core/pagination";
import { IRepository } from "../core/repository";
import { Members } from "@/drizzle/schema";
import { asc, desc, eq, like, or } from "drizzle-orm/expressions";
import { CountResult } from "@/core/returnTypes";
import { IMember, IMemberBase } from "@/Models/member.model";
import { MemberSortOptions, SortOptions } from "@/lib/data";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { count } from "drizzle-orm/sql";

export class MemberRepository implements IRepository<IMemberBase, IMember> {
  constructor(private db: VercelPgDatabase<Record<string, unknown>>) {}
  async create(data: IMemberBase): Promise<IMember | null> {
    try {
      const [result] = await this.db
        .insert(Members)
        .values({
          ...data,
        })
        .returning({ id: Members.id });
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

  async list(
    params: IPageRequest,
    sortOptions?: MemberSortOptions
  ): Promise<IPagesResponse<IMember>> {
    let search = params.search ? params.search.toLowerCase() : "";

    let sortOrder;
    let selectSql: IMember[];
    let countResult: CountResult;

    // Check for valid sorting options and set default if not provided
    if (sortOptions) {
      const sortBy = Members[sortOptions.sortBy] || Members.firstName; // Default to author if sortBy is invalid
      sortOrder = sortOptions.sortOrder === "desc" ? desc(sortBy) : asc(sortBy);
    } else {
      // Fallback to default sort
      sortOrder = asc(Members.firstName); // Default sort by title in ascending order
    }

    try {
      // Build the query with search, pagination, and sorting
      if (search) {
        selectSql = (await this.db
          .select()
          .from(Members)
          .where(
            or(
              like(Members.email, `%${search}%`),
              like(Members.firstName, `%${search}%`),
              like(Members.lastName, `%${search}%`),
              like(Members.role, `%${search}%`)
            )
          )
          .limit(params.limit ?? 10) // Add a default limit
          .offset(params.offset ?? 0)
          .orderBy(sortOrder)) as IMember[];
      } else {
        selectSql = (await this.db
          .select()
          .from(Members)
          .limit(params.limit ?? 10) // Add a default limit
          .offset(params.offset ?? 0)
          .orderBy(sortOrder)) as IMember[];
      }

      // Get the count of books
      [countResult] = await this.db
        .select({ count: count() })
        .from(Members)
        .where(
          search
            ? or(
                like(Members.email, `%${search}%`),
                like(Members.firstName, `%${search}%`),
                like(Members.lastName, `%${search}%`),
                like(Members.role, `%${search}%`)
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
