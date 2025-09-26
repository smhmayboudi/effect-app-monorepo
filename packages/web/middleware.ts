import { NextRequest } from "next/server";
import { v7 } from "uuid";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(v7()).toString("base64");
  const cspHeader =
    "base-uri 'self' http://127.0.0.1:3002 http://localhost:3002; " +
    "child-src 'none'; " +
    "connect-src 'self' http://127.0.0.1:3001 http://127.0.0.1:3002 http://localhost:3001 http://localhost:3002 https://www.google-analytics.com; " +
    "default-src 'self'; " +
    "font-src 'self'; " +
    "form-action 'self'; " +
    "frame-ancestors 'none'; " +
    "frame-src 'none'; " +
    "img-src 'self' blob: data: https://www.google-analytics.com; " +
    "media-src 'none'; " +
    "object-src 'none'; " +
    "report-uri /api/csp; " +
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: ${
      process.env.NODE_ENV === "production" ? "" : "'unsafe-eval'"
    } https://www.googletagmanager.com; ` +
    `style-src 'self' 'nonce-${nonce}' ${
      process.env.NODE_ENV === "production" ? "" : "'unsafe-inline'"
    }; ` +
    "upgrade-insecure-requests; " +
    "worker-src 'none';";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", cspHeader);
  requestHeaders.set("x-nonce", nonce);

  // const response = NextResponse.next({
  //   request: {
  //     headers: requestHeaders,
  //   },
  // });
  const response = createMiddleware(routing)(request);
  response.headers.set("Content-Security-Policy", cspHeader);

  // response.headers.set("Cache-Control", "max-age=3600, s-maxage=86400");
  // response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  // response.headers.set("X-Content-Type-Options", "nosniff");
  // response.headers.set("X-Frame-Options", "DENY");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
      source:
        "/((?!_next/image|_next/static|api|apple-icon|favicon.ico|icon|opengraph-image|robots|twitter-image).*)",
    },
  ],
};
