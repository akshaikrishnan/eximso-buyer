import api from "@/lib/api/axios.interceptor";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const token = url.searchParams.get("token");
    const from = url.searchParams.get("from");
    const newUser = url.searchParams.get("newUser");
    const toPath = from || "/";

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Will throw if invalid
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    if (!decodedToken) {
      return NextResponse.redirect(new URL("/auth/error", req.url));
    }

    // Optional: sync cart (errors here shouldn't block login flow)
    try {
      const cookieStore = await cookies();
      const deviceToken = cookieStore.get("device_token")?.value;
      await api.post("/cart/sync", {
        deviceToken,
        accessToken: token,
      });
    } catch (err) {
      console.log("Error syncing cart:", err);
    }

    // Decide where to redirect
    const redirectUrl =
      newUser === "true"
        ? new URL("/profile", req.url)
        : new URL(toPath, req.url);

    // Create response and set cookie on it
    const res = NextResponse.redirect(redirectUrl);
    res.cookies.set({
      name: "access_token",
      value: token,
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20), // 20 days
      secure: process.env.NODE_ENV === "production",
      httpOnly: true, // recommended for auth tokens
      sameSite: "lax",
    });

    return res;
  } catch (e) {
    console.log(e);
    return NextResponse.redirect(new URL("/auth/error", req.url));
  }
}
