import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log({ csp: body });
  return new NextResponse(null, { status: 204 });
}
