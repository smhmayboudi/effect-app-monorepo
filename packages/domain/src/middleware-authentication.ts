import { HttpApiMiddleware, HttpApiSecurity } from "@effect/platform"
import { DomainActor, ErrorActorUnauthorized } from "@template/domain/actor"

export class MiddlewareAuthentication extends HttpApiMiddleware.Tag<MiddlewareAuthentication>()(
  "MiddlewareAuthentication",
  {
    failure: ErrorActorUnauthorized,
    provides: DomainActor,
    security: {
      cookie: HttpApiSecurity.apiKey({ in: "cookie", key: "token" })
    }
  }
) {}
