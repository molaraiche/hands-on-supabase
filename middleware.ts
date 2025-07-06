import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isProtected = request.nextUrl.pathname.startsWith("/");
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/register", request.url));
  }
  if (
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "register") &&
    token
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
