import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { Appenv } from "./read-env";
import { auth } from "./auth";

export async function middleware(req) {
  const token = await getToken({ req, secret: Appenv.AUTH_SECRET });
  const session = await auth()
;  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login")) {
    console.log(session.user)
    const isLoggedIn = !!token;
    if (isLoggedIn && token.role === "user") {
      return NextResponse.redirect(new URL("/home/books", req.url));
    } else if (token?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/books", req.url));
    }
    // if (token.role !== "admin") {
    //   return NextResponse.redirect(new URL("/home", req.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
