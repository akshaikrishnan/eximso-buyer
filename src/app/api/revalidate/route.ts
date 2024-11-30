import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<NextResponse> {
    const data = await req.json();
    revalidateTag(data.tag);
    return NextResponse.json({ success: true })
}
