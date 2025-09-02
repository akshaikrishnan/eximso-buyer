import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  try {
    cookieStore.delete("access_token");
    const url = req.nextUrl;
    const from = url.searchParams.get("from") || "/";
    return NextResponse.json({
      message: "Logged out successfully",
      from: from,
      success: true,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      error: e,
    });
  }
}
