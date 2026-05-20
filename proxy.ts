import { NextRequest, NextResponse } from "next/server";

// Routes that require a logged-in session
const PROTECTED = ["/calculator"];

// Routes only accessible when NOT logged in (redirect to /description if already authed)
const AUTH_ONLY = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = request.cookies.get("nextarch_user")?.value;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p));

  // ── Not logged in → trying to reach protected page → go to login
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    // Preserve where they wanted to go so we can redirect back after login (optional)
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Already logged in → trying to access login/register → send to description
  if (isAuthOnly && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/calculator";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except Next.js internals, static files, and API routes
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};

