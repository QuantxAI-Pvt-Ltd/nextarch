import { NextRequest, NextResponse } from "next/server";

export function POST(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/description";
  url.search = "";
  const response = NextResponse.redirect(url);
  
  // Clear auth and pending legal cookies
  response.cookies.delete("nextarch_user");
  response.cookies.delete("nextarch_pending_legal");
  
  return response;
}
