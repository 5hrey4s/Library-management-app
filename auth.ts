import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/mysql2";
import { MemberRepository } from "./Repositories/member.repository";
import { IMember } from "./Models/member.model";
import { authOptions } from "./authOptions";
import Google from "next-auth/providers/google";
import { Appenv } from "./read-env";

const pool = mysql.createPool(Appenv.DATABASE_URL);

const db = drizzle(pool);
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
          role: "admin",
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
