// auth.ts

import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "./drizzle/schema"; // Ensure this path is correct
import { MemberRepository } from "./Repositories/member.repository"; // Ensure this path is correct
import { IMember } from "./Models/member.model"; // Ensure this path is correct
import { createMember, fetchMemberByEmail } from "./lib/data"; // Ensure this path is correct

// Initialize database connection
const db = drizzle(sql, { schema });
const memberRepository = new MemberRepository(db);

/**
 * Fetches a user from the database by email.
 * @param email The user's email address.
 * @returns A promise that resolves to the user object or undefined if not found.
 */
async function getUser(email: string): Promise<IMember | undefined> {
  try {
    const user = await memberRepository.getByEmail(email);
    if (user) return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

/**
 * Maps the database member object to the user object expected by NextAuth.
 * @param member The member object from the database.
 * @returns A user object compatible with NextAuth.
 */
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
  // It's good practice to be explicit about session strategy and secrets.
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // This profile function ensures every Google user gets a default role.
      profile(profile) {
        return {
          ...profile,
          id: profile.sub,
          role: "user",
        };
      },
    }),
    Credentials({
      async authorize(credentials) {
        // Using Zod for validation is a robust approach.
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);

          if (!user) return null; // User not found

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return mapMemberToUser(user);
        }

        console.log("Invalid credentials provided.");
        return null;
      },
    }),
  ],
  callbacks: {
    // This callback is crucial for Google Sign-Up. It creates a new user if they don't exist.
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          if (user && user.email) {
            const existingUser = await fetchMemberByEmail(user.email);
            if (!existingUser) {
              await createMember({
                firstName: user.name!,
                lastName: "", // Google doesn't provide a separate last name
                email: user.email!,
                // Use a secure random value or the Google ID as a placeholder for the password hash
                password: user.id!,
                role: "user",
                phoneNumber: "",
                accessToken: "",
                refreshToken: "",
                user_id: "",
                credits: 0,
              });
            }
          }
        } catch (error) {
          console.error("Error during Google user creation:", error);
          return false; // Prevent sign-in if user creation fails
        }
      }
      return true; // Allow sign-in
    },

    // The jwt callback adds custom data (like 'role') to the token.
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    // The session callback passes the data from the token to the client-side session object.
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});