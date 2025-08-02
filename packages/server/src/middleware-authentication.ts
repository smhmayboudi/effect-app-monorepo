import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { ErrorActorUnauthorized } from "@template/domain/actor"
import { MiddlewareAuthentication } from "@template/domain/middleware-authentication"
import { AccessToken, UserId } from "@template/domain/user/application/domain-user"
import { PortUserDriving } from "@template/server/domain/user/application/port-user-driving"
import { Effect, Layer } from "effect"

export const MiddlewareAuthenticationLive = Layer.effect(
  MiddlewareAuthentication,
  Effect.gen(function*() {
    const user = yield* PortUserDriving

    return MiddlewareAuthentication.of({
      cookie: (token) =>
        user.readByAccessToken(AccessToken.make(token))
          .pipe(
            Effect.catchTag("ErrorUserNotFoundWithAccessToken", () =>
              Effect.fail(
                new ErrorActorUnauthorized({
                  actorId: UserId.make(-1),
                  entity: "User",
                  action: "read"
                })
              )),
            Effect.flatMap(Effect.succeed),
            Effect.withSpan("MiddlewareAuthentication", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "cookie", token } })
          )
    })
  })
)
