import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/description";
  url.search = "";
  const response = NextResponse.redirect(url);
  // Clear the auth cookie
  response.cookies.delete("nextarch_user");
  return response;
}
