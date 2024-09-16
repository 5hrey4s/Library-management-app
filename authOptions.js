import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

import { MemberRepository } from "./Repositories/member.repository";
import { drizzle } from "drizzle-orm/mysql2";
import { Appenv } from "./read-env";

const pool = mysql.createPool(Appenv.DATABASE_URL);

const db = drizzle(pool);
const memberRepository = new MemberRepository(db);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: Appenv.AUTH_GOOGLE_ID,
      clientSecret: Appenv.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials;

        try {
          const user = await memberRepository.getByEmail(email);
          if (!user) {
            console.error("User not found");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.error("Invalid password");
            return null;
          }

          return { id: user.id, email: user.email };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  secret: Appenv.AUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userInDb = await memberRepository.getByEmail(user.email);
        if (userInDb) {
          token.role = userInDb.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
