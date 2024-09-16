import { DefaultSession } from "next-auth";
import { Session } from "next-auth";
import "next-auth/jwt";
declare module "next-auth" {
  interface User {
    // role: "admin" | "user";
    role: string ;
  }
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      //   role: "admin" | "user";
    } & DefaultSession["user"];
  }

  interface Session {
    // role: "admin" | "user";
    role:string

  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role:string
    // role: "admin" | "user";
  }
}
