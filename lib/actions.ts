"use server";

import { auth, signIn, signOut } from "@/auth";
// import { AuthError } from 'next-auth';
import { AuthError } from "next-auth";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { Members, Requests } from "@/drizzle/schema";
import { count, eq, like, or } from "drizzle-orm";
import { MemberRepository } from "@/Repositories/member.repository";
import { IMember, IMemberBase } from "@/Models/member.model";
import { RequestRepository } from "@/Repositories/request.repository";
import { TransactionRepository } from "@/Repositories/transaction.repository";
import { revalidatePath } from "next/cache";
import { Appenv } from "@/read-env";

const pool = mysql.createPool(
  Appenv.DATABASE_URL
);

const db = drizzle(pool);
const requestRepository = new RequestRepository(db);
const transactionRepository = new TransactionRepository(db);
const memberRepository = new MemberRepository(db);

export const create = new MemberRepository(db).create;

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function authenticateLogout(
  _state: void | undefined,
  _formData: FormData
): Promise<void> {
  try {
    await signOut({ redirectTo: "/login", redirect: true });
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

export async function handleApprove(data: any) {
  await db
    .update(Requests)
    .set({
      status: "Approved",
    })
    .where(eq(Requests.id, data.id));
  await transactionRepository.create({
    bookId: data.bookId,
    memberId: data.memberId,
  });
  revalidatePath("/home/requests");
}

export async function handleReject(data: any) {
  await db
    .update(Requests)
    .set({
      status: "Rejected",
    })
    .where(eq(Requests.id, data.id));

  revalidatePath("/home/requests");
}

export async function createMember(data: IMemberBase): Promise<IMember | null> {
  console.log(data);

  try {
    const [result] = await db
      .insert(Members)
      .values({
        ...data,
      })
      .$returningId();
    const [member]: IMember[] = await db
      .select()
      .from(Members)
      .where(eq(Members.id, result.id));
    return member;
  } catch (err) {
    throw err;
  }
}

export const authenticateGoogleSignin = async (
  email: string,
  refreshToken: string
) => {
  try {
    // Check if the user exists in database
    let user: IMember | null = (await memberRepository.getByEmail(email))!;
    console.log(user);
    if (!user) {
      return null;
    } else {
      return { id: user.id, role: user.role };
    }
  } catch (error) {
    if (error instanceof Error) throw error;
  }
};

function formDataToObject(formData: any) {
  const obj: { [key: string]: any } = {};

  // Access the existing Symbol in the formData object
  const symbolState = Object.getOwnPropertySymbols(formData).find(
    (sym) => sym.toString() === "Symbol(state)"
  );

  if (symbolState) {
    for (const { name, value } of formData[symbolState]) {
      obj[name] = value;
    }
  }

  return obj;
}

export const editProfile = async (
  prevState: void | undefined,
  formData: FormData
) => {
  try {
    const session = await auth();
    const user = await memberRepository.getByEmail(
      session?.user.email as string
    );
    const data = formDataToObject(formData);
    (await memberRepository.update(user?.id!, data))!;
    revalidatePath("/home/profile");
  } catch (error) {
    if (error instanceof Error) throw error;
  }
};
