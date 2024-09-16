// import type { NextAuthConfig } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { Appenv } from "./read-env";
// import mysql from "mysql2/promise";
// import { MemberRepository } from "./Repositories/member.repository";
// import { drizzle } from "drizzle-orm/mysql2";

// export const authConfig = {
//   pages: {
//     signIn: "/login",
//     signOut: "/",
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       const isLoggedIn = !!auth?.user;
//       const isOnDashboard = nextUrl.pathname.startsWith("/home/");
//       if (isOnDashboard ) {
//         if (isLoggedIn) return true;
//         return false; // Redirect unauthenticated users to login page
//       } else if (isLoggedIn) {
//         return Response.redirect(new URL("/home/books", nextUrl));
//       }
//       return true;
//     },

//     //invoked on successsful signin
//     async signIn({ profile }) {
//       console.log(profile)
//       // 1.connect to database
//       // 2.check if the user exists
//       // 3.if not then add the user to the database
//       // 4. return true to allow signin
//       return true;
//     },

//     async session({ session }) {
//       // const user = await memberRepository.getByEmail(session.user.email);
//       // session.
//       return session;
//     },
//   },

//   providers: [ 
//     GoogleProvider({
//       clientId: Appenv.AUTH_GOOGLE_ID,
//       clientSecret: Appenv.AUTH_GOOGLE_SECRET,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//   ], // Add providers with an empty array for now
// } satisfies NextAuthConfig;
