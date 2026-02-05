import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Example function to validate auth
  const token = request.cookies.get("access_token")?.value;
  
  if (token) {
    const response = NextResponse.next();
    // Add headers to prevent caching of sensitive pages
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Referrer-Policy", "no-referrer-when-downgrade");
    return response;
  }

  const sellerurl = process.env.NEXT_PUBLIC_SELLER_URL;
  const loginUrl = new URL("/auth/login", sellerurl);
  
  // Use absolute URL for 'from' parameter to ensure correct cross-domain redirect back to the buyer site
  const fromUrl = new URL(request.nextUrl.pathname + request.nextUrl.search, request.url);
  loginUrl.searchParams.set("from", fromUrl.toString());
  loginUrl.searchParams.set("userType", "Buyer");

  const response = NextResponse.redirect(loginUrl);
  
  // Ensure the redirect itself is not cached
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Referrer-Policy", "no-referrer-when-downgrade");
  
  return response;
}

export const config = {
  matcher: ["/profile", "/profile/:path*", "/checkout"],
};
