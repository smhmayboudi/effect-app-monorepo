import * as HttpApiMiddleware from "@effect/platform/HttpApiMiddleware"
import * as HttpApiSecurity from "@effect/platform/HttpApiSecurity"
import * as OpenApi from "@effect/platform/OpenApi"
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
