import { HttpApiMiddleware, HttpApiSecurity, OpenApi } from "@effect/platform"
import { Actor, ActorErrorUnauthorized } from "./Actor.js"

export class PortMiddlewareAuthentication extends HttpApiMiddleware.Tag<PortMiddlewareAuthentication>()(
  "PortMiddlewareAuthentication",
  {
    failure: ActorErrorUnauthorized,
    provides: Actor,
    security: {
      cookie: HttpApiSecurity.apiKey({ in: "header", key: "token" }).pipe(
        HttpApiSecurity.annotate(OpenApi.Description, "description")
      )
    }
  }
) {}
