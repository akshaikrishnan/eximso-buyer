import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  try {
    cookieStore.delete("access_token");
    const url = req.nextUrl;
    const from = url.searchParams.get("from") || "/";

    // Return seller logout URL for the client to call (cross-domain cookie clearing)
    let sellerLogoutUrl: string | null = null;
    if (process.env.NEXT_PUBLIC_SELLER_URL) {
      const url = new URL(
        "/api/auth/logout",
        process.env.NEXT_PUBLIC_SELLER_URL
      );
      url.searchParams.set("userType", "buyer");
      sellerLogoutUrl = url.toString();
    }

    return NextResponse.json({
      message: "Logged out successfully",
      from: from,
      success: true,
      sellerLogoutUrl: sellerLogoutUrl,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      error: e,
    });
  }
}
