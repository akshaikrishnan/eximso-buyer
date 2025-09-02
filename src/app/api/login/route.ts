import api from "@/lib/api/axios.interceptor";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = req.nextUrl;
    const token = url.searchParams.get("token");
    const from = url.searchParams.get("from");
    const newUser = url.searchParams.get("newUser");
    const toPath = url.searchParams.get("from") || "/";
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    // const user = await findOne({ email: email });
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log(decodedToken);

    if (!decodedToken) {
      return NextResponse.redirect(new URL("/auth/error", req.url));
    }

    try {
      const deviceToken = (await cookies()).get("device_token")?.value;
      const syncCart = await api.post("/cart/sync", {
        deviceToken,
        accessToken: token,
      });
      console.log(syncCart.data);
    } catch (error) {
      console.log("Error syncing cart:", error);
    }

    (await cookies()).set({
      name: "access_token",
      value: token,
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20), // 20 days
      secure: process.env.NODE_ENV === "production",
    });
    if (newUser === "true") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
    if (from) {
      return NextResponse.redirect(new URL(from, req.url));
    }
    return NextResponse.redirect(new URL(toPath, req.url));
  } catch (e) {
    console.log(e);
    return NextResponse.redirect(new URL("/auth/error", req.url));
  }
}
