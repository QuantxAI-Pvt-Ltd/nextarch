import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";

// Routes that require a logged-in session
const PROTECTED = ["/calculator", "/subscribe"];

// Routes only accessible when NOT logged in (redirect to /calculator if already authed)
const AUTH_ONLY = ["/login", "/register"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("nextarch_user")?.value;
  const user = await verifySessionToken(token);

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p));

  // ── Not logged in or invalid token → trying to reach protected page → go to login
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);

    const response = NextResponse.redirect(loginUrl);
    // If token existed but was invalid/tampered, clear it
    if (token) {
      response.cookies.delete("nextarch_user");
    }
    return response;
  }

  // ── Already logged in → trying to access login/register → send to calculator
  if (isAuthOnly && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/calculator";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run proxy on all routes except Next.js internals, static files, and API routes
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
