import { getCookieCache } from "better-auth/cookies"
import createMiddleware from "next-intl/middleware"
import {
  type MiddlewareConfig,
  type NextRequest,
  NextResponse,
} from "next/server"
import { v7 } from "uuid"

import { routing } from "@/i18n/routing"

export async function proxy(request: NextRequest) {
  const isAuth = ["/forgot-password", "/sign-in", "/sign-up"].some((route) =>
    request.nextUrl.pathname.includes(route),
  )
  const isProtectedRoute = ["/admin", "/user"].some((route) =>
    request.nextUrl.pathname.includes(route),
  )
  const session = await getCookieCache(request, {
    cookiePrefix: "effect-app-monorepo-00000000-0000-0000-0000-000000000000",
    secret: "better-auth-secret-123456789-00000000-0000-0000-0000-000000000000",
  })
  const pathname = request.nextUrl.pathname
  const locale = pathname.split("/")[1]
  const currentLocale = routing.locales.includes(locale as "en" | "fa")
    ? locale
    : routing.defaultLocale
  if (isAuth && session) {
    const redirectUrl = new URL(`/${currentLocale}`, request.nextUrl)

    return NextResponse.redirect(redirectUrl)
  }
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL(`/${currentLocale}/sign-in`, request.nextUrl)
    redirectUrl.searchParams.set("callbackURL", pathname)

    return NextResponse.redirect(redirectUrl)
  }

  const nonce = Buffer.from(v7()).toString("base64")
  const cspHeader =
    "base-uri 'self' http://127.0.0.1:3002; " +
      "child-src 'none'; " +
      "connect-src 'self' http://127.0.0.1:3001 http://127.0.0.1:3002 https://www.google-analytics.com; " +
      "default-src 'self'; " +
      "font-src 'self'; " +
      "form-action 'self'; " +
      "frame-ancestors 'none'; " +
      "frame-src 'none'; " +
      "img-src 'self' blob: data: https://www.googletagmanager.com/; " +
      "media-src 'none'; " +
      "object-src 'none'; " +
      "report-uri /api/csp; " +
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: ${
        process.env.NODE_ENV === "production" ? "" : "'unsafe-eval'"
      } https://www.googletagmanager.com; ` +
      `style-src 'self' 'nonce-${nonce}' ${process.env.NODE_ENV === "production" ? "" : "'unsafe-inline'"}; ` +
      process.env.NODE_ENV ===
    "production"
      ? "upgrade-insecure-requests; "
      : "" + "worker-src 'none';"

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("Content-Security-Policy", cspHeader)
  requestHeaders.set("x-nonce", nonce)

  const response = createMiddleware(routing)(request)
  response.headers.set("Content-Security-Policy", cspHeader)
  // response.headers.set("Cache-Control", "max-age=3600, s-maxage=86400");
  // response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  // response.headers.set("X-Content-Type-Options", "nosniff");
  // response.headers.set("X-Frame-Options", "DENY");

  return response
}

export const config: MiddlewareConfig = {
  matcher: [
    {
      missing: [
        { key: "next-router-prefetch", type: "header" },
        { key: "purpose", type: "header", value: "prefetch" },
      ],
      source:
        "/((?!_next/image|_next/static|api|apple-icon$|favicon.ico|icon$|manifest.webmanifest|opengraph-image$|robots.txt|sitemap.xml|twitter-image$|shadcn.jpg).*)",
    },
  ],
}
