import { HttpApiMiddleware, HttpApiSecurity, OpenApi } from "@effect/platform"
import { Actor, ActorErrorUnauthorized } from "./Actor.js"

export class PortMiddlewareAuthentication extends HttpApiMiddleware.Tag<PortMiddlewareAuthentication>()(
  "PortMiddlewareAuthentication",
  {
    failure: ActorErrorUnauthorized,
    optional: false,
    provides: Actor,
    security: {
      cookie: HttpApiSecurity.apiKey({
        in: "cookie",
        key: "effect-app-monorepo-00000000-0000-0000-0000-000000000000.session_token"
      }).pipe(
        HttpApiSecurity.annotate(OpenApi.Description, "description")
      )
    }
  }
) {}
