// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   // Example function to validate auth
//   const token = request.cookies.get("access_token")?.value;
//   if (token) {
//     return NextResponse.next();
//   }
//   const sellerurl = process.env.NEXT_PUBLIC_SELLER_URL;
//   const loginUrl = new URL("/auth/login", sellerurl);
//   loginUrl.searchParams.set("from", request.nextUrl.pathname);
//   loginUrl.searchParams.set("userType", "Buyer");

//   return NextResponse.redirect(loginUrl);
// }

// export const config = {
//   matcher: ["/profile/:path*", "/checkout"],
// };


  
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add Authorization header for backend requests
  if (request.nextUrl.pathname.startsWith("/backend")) {
    const token = request.cookies.get("access_token")?.value;
    if (token) {
      response.headers.set("Authorization", `Bearer ${token}`);
    }
    const deviceToken = request.cookies.get("device_token")?.value;
    if (deviceToken) {
      response.headers.set("DeviceToken", deviceToken);
    }
    const language = request.cookies.get("Next-Locale")?.value || "en";
    response.headers.set("language", language);
    const country = request.cookies.get("country")?.value;
    if (country) {
      response.headers.set("country", country);
    }
  }

  // Example function to validate auth for protected routes
  const token = request.cookies.get("access_token")?.value;
  if (!token && (request.nextUrl.pathname.startsWith("/profile") || request.nextUrl.pathname.startsWith("/checkout"))) {
    const sellerurl = process.env.NEXT_PUBLIC_SELLER_URL;
    const loginUrl = new URL("/auth/login", sellerurl);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    loginUrl.searchParams.set("userType", "Buyer");

    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/backend/:path*", "/profile/:path*", "/checkout"],
};
