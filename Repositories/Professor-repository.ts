import { formatDate } from "../core/formatdate";
import { IPageRequest, IPagesResponse } from "../core/pagination";
import { IRepository } from "../core/repository";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { eq, like, or, asc, desc } from "drizzle-orm/expressions";
import { error } from "node:console";
import { Professors } from "@/drizzle/schema";
import { CountResult } from "@/core/returnTypes";
import { count } from "drizzle-orm/sql";
import { IProfessor, IProfessorBase } from "@/Models/professor.model";

export class ProfessorRepository
  implements IRepository<IProfessorBase, IProfessor>
{
  constructor(private db: VercelPgDatabase<Record<string, unknown>>) {}
  delete(id: number): Promise<IProfessor | null> {
    throw new Error("Method not implemented.");
  }

  async create(data: IProfessorBase): Promise<IProfessor | null> {
    const professor: Omit<IProfessor, "id"> = {
      ...data,
    };
    const [result] = await this.db
      .insert(Professors)
      .values(professor)
      .returning({ id: Professors.id });
    const [createdProfessor]: IProfessor[] = await this.db
      .select()
      .from(Professors)
      .where(eq(Professors.id, result.id));
    return createdProfessor;
  }

  async update(
    id: number,
    data: Partial<IProfessorBase>
  ): Promise<IProfessor | null> {
    await this.db
      .update(Professors)
      .set(data)
      .where(eq(Professors.id, id))
      .returning();
    const [updatedProfessor]: IProfessor[] = await this.db
      .select()
      .from(Professors)
      .where(eq(Professors.id, id));
    return updatedProfessor;
  }

  async getById(id: number): Promise<IProfessor | null> {
    const [professor]: IProfessor[] = await this.db
      .select()
      .from(Professors)
      .where(eq(Professors.id, id));

    return professor || null;
  }

  async getByEmail(email: string): Promise<IProfessor | null> {
    const [professor]: IProfessor[] = await this.db
      .select()
      .from(Professors)
      .where(eq(Professors.email, email));

    return professor || null;
  }

  async list(params: IPageRequest): Promise<IPagesResponse<IProfessor>> {
    const search = params.search ? params.search.toLowerCase() : "";
    let selectSql: IProfessor[];
    let countResult: CountResult;

    try {
      if (search) {
        selectSql = await this.db
          .select()
          .from(Professors)
          .where(
            or(
              like(Professors.name, `%${search}%`),
              like(Professors.department, `%${search}%`)
            )
          )
          .limit(params.limit ?? 10)
          .offset(params.offset ?? 0);
      } else {
        selectSql = await this.db
          .select()
          .from(Professors)
          .limit(params.limit ?? 10)
          .offset(params.offset ?? 0);
      }

      [countResult] = await this.db
        .select({ count: count() })
        .from(Professors)
        .where(
          search
            ? or(
                like(Professors.name, `%${search}%`),
                like(Professors.department, `%${search}%`)
              )
            : undefined
        );

      const total = countResult.count;

      return {
        items: selectSql,
        pagination: {
          offset: params.offset,
          limit: params.limit,
          total,
        },
      };
    } catch (error) {
      console.log(error);
      throw new Error("Not found");
    }
  }
}
