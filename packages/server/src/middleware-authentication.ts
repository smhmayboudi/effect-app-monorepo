import { MiddlewareAuthentication } from "@template/domain/middleware-authentication"
import { Effect, Layer } from "effect"
import { PortUserDriving } from "./domain/user/application/port-user-driving.js"
import { AccessToken, UserId } from "@template/domain/user/application/domain-user"
import { ErrorActorUnauthorized } from "@template/domain/actor"

export const MiddlewareAuthenticationLive = Layer.effect(
  MiddlewareAuthentication,
  Effect.gen(function*() {
    const user = yield* PortUserDriving

    return MiddlewareAuthentication.of({
      cookie: (token) =>
        user.readByAccessToken(AccessToken.make(token))
          .pipe(
            Effect.catchTag("ErrorUserNotFoundWithAccessToken", () => Effect.fail(
              ErrorActorUnauthorized.make({
                actorId: UserId.make(-1),
                entity: "User",
                action: "read"
              })
            )),
            Effect.flatMap(Effect.succeed),
            Effect.withSpan("MiddlewareAuthentication.cookie")
          )
    })
  })
)
