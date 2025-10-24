import type { NextRequest } from "next/server"

import { NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  console.debug({ csp: body })
  return new NextResponse(null, { status: 204 })
}
