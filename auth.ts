import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { MemberRepository } from "./Repositories/member.repository";
import { IMember } from "./Models/member.model";
import { authOptions } from "./authOptions";
import Google from "next-auth/providers/google";
import "@/drizzle/envConfig";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./drizzle/schema";
import { createMember, fetchMemberByEmail } from "./lib/data";

const db = drizzle(sql, { schema });
const memberRepository = new MemberRepository(db);

async function getUser(email: string): Promise<IMember | undefined> {
  try {
    const user = await memberRepository.getByEmail(email);
    if (user) return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

function mapMemberToUser(member: {
  id: any;
  firstName: any;
  email: any;
  role: string;
}): User {
  return {
    id: member.id.toString(),
    name: member.firstName,
    email: member.email,
    role: member.role,
  };
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authOptions,
  providers: [
    Google({
      profile(profile) {
        return {
          ...profile,
          role: "user",
        };
      },
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return mapMemberToUser(user);
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          if (user) {
            const existingUser = await fetchMemberByEmail(user.email!);
            if (!existingUser) {
              const result = await createMember({
                firstName: user.name!,
                lastName: "",
                email: user.email!,
                password: user.id!,
                role: "user",
                phoneNumber: "",
                accessToken: "",
                refreshToken: "",
                user_id: "",
              });
            }
          }
        } catch (error) {
          console.error("Error creating user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, profile }) {
      if (user) {
        token.role = user.role;
      }
      if (profile && profile.picture) token.image = profile.picture;
      // console.log("token",token)
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
});
