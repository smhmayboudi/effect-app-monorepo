import { HttpApiMiddleware, HttpApiSecurity, OpenApi } from "@effect/platform"
import { Actor, ActorErrorUnauthorized } from "./Actor.js"

export class MiddlewareAuthentication extends HttpApiMiddleware.Tag<MiddlewareAuthentication>()(
  "MiddlewareAuthentication",
  {
    failure: ActorErrorUnauthorized,
    provides: Actor,
    security: {
      cookie: HttpApiSecurity.apiKey({ in: "cookie", key: "token" }).pipe(
        HttpApiSecurity.annotate(OpenApi.Description, "description")
      )
    }
  }
) {}
