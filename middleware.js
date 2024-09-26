import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { Appenv } from "./read-env";
import { routing } from "./i18n/routing";

// import createMiddleware from "next-intl/middleware";
// export default createMiddleware(routing);
// export const config = {
//   matcher: ["/", "/(kn|en)/:path*"],
// };
// export const config = {
//   // Skip all paths that should not be internationalized
//   matcher: ["/((?!api|_next|.*\\..*).*)"],
// };
// export default createMiddleware(routing);

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: Appenv.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;

  if (pathname.startsWith(`/login`)) {
    console.log(token);
    const isLoggedIn = !!token;
    if (isLoggedIn && token.role === "user") {
      return NextResponse.redirect(new URL(`/home/books`, req.url));
    } else if (token?.role === "admin") {
      return NextResponse.redirect(new URL(`/admin/books`, req.url));
    } else if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/login`, req.url));
    }
    // if (token.role !== "admin") {
    //   return NextResponse.redirect(new URL("/home", req.url));
    // }
  }
  // return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
  // matcher: ["/", "/(kn|en)/:path*"],
};
