import type { NextRequest } from "next/server"

import { NextResponse } from "next/server"

const allowedOrigins = ["http://127.0.0.1:3002"]

export async function GET(request: NextRequest) {
  return handler(request)
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    headers: {
      "access-control-allow-credentials": "true",
      "access-control-allow-headers":
        "authorization,b3,content-type,idempotency-key,traceparent",
      "access-control-allow-methods": "DELETE,GET,OPTIONS,PATCH,POST,PUT",
      "access-control-allow-origin": allowedOrigins.includes(
        request.headers.get("origin") ?? "",
      )
        ? (request.headers.get("origin") ?? "")
        : "",
      "access-control-expose-headers": "authorization,content-type,set-cookie",
      "access-control-max-age": "86400",
    },
    status: 200,
  })
}

export async function POST(request: NextRequest) {
  return handler(request)
}

async function handler(request: NextRequest) {
  try {
    const headers = new Headers()
    headers.set("Content-Type", "application/json")
    const authHeader = request.headers.get("authorization")
    if (authHeader) {
      headers.set("Authorization", authHeader)
    }
    const cookieHeader = request.headers.get("cookie")
    if (cookieHeader) {
      headers.set("Cookie", cookieHeader)
    }
    const origin = request.headers.get("origin")
    if (origin) {
      headers.set("origin", origin)
    }
    const { pathname } = new URL(request.url)
    const response = await fetch(
      `http://127.0.0.1:3001/auth/00000000-0000-0000-0000-000000000000/${pathname.replace(
        "/api/auth/",
        "",
      )}`,
      {
        body: request.method !== "GET" ? await request.text() : undefined,
        credentials: "include",
        headers,
        method: request.method,
      },
    )
    const data = await response.json()
    const res = NextResponse.json(data, {
      headers: {
        "access-control-allow-credentials": "true",
        "access-control-allow-headers":
          "authorization,b3,content-type,idempotency-key,traceparent",
        "access-control-allow-methods": "DELETE,GET,OPTIONS,PATCH,POST,PUT",
        "access-control-allow-origin": allowedOrigins.includes(origin ?? "")
          ? (origin ?? "")
          : "",
        "access-control-expose-headers":
          "authorization,content-type,set-cookie",
        "access-control-max-age": "86400",
      },
      status: response.status,
    })
    const setCookie = response.headers.get("set-cookie")
    if (setCookie) {
      res.headers.set("set-cookie", setCookie)
    }

    return res
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
