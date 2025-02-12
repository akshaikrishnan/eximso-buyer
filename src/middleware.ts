import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Example function to validate auth
  const token = request.cookies.get("access_token")?.value;
  if (token) {
    return NextResponse.next();
  }
  const sellerurl = process.env.NEXT_PUBLIC_SELLER_URL;
  const loginUrl = new URL("/login", sellerurl);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: "/profile/:path*",
};
