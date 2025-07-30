import { HttpApiMiddleware, HttpApiSecurity } from "@effect/platform"
import { DomainUserCurrent } from "./user/application/domain-user.js"
import { ErrorActorUnauthorized } from "./actor.js"

export class MiddlewareAuthentication extends HttpApiMiddleware.Tag<MiddlewareAuthentication>()(
  "MiddlewareAuthentication",
  {
    failure: ErrorActorUnauthorized,
    provides: DomainUserCurrent,
    security: {
      cookie: HttpApiSecurity.apiKey({
        in: "cookie",
        key: "token"
      })
    }
  }
) {}
