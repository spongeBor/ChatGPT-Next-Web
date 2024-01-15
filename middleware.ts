import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const redirectUrl = new URL("/#/auth", request.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/#/:path"],
};
