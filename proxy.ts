import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile"];

export function proxy(request: NextRequest) {
  const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  // Replace this placeholder with Auth.js/session validation when auth is finalized.
  const hasSession = Boolean(request.cookies.get("afiyapal_session")?.value);
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"]
};
