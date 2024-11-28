import api from "@/lib/api/axios.interceptor";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = req.nextUrl;
    const token = url.searchParams.get("token");
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
    cookies().set({
      name: "access_token",
      value: token,
      path: "/",
    });
    return NextResponse.redirect(new URL(toPath, req.url));
  } catch (e) {
    return NextResponse.redirect(new URL("/auth/error", req.url));
  }
}
