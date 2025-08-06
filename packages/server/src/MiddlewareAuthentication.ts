import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { ActorErrorUnauthorized } from "@template/domain/Actor"
import { MiddlewareAuthentication } from "@template/domain/MiddlewareAuthentication"
import { AccessToken, UserId } from "@template/domain/user/application/UserApplicationDomain"
import { Effect, Layer } from "effect"
import { UserPortDriving } from "./domain/user/application/UserApplicationPortDriving.js"

export const MiddlewareAuthenticationLive = Layer.effect(
  MiddlewareAuthentication,
  Effect.gen(function*() {
    const user = yield* UserPortDriving

    return MiddlewareAuthentication.of({
      cookie: (token) =>
        user.readByAccessToken(AccessToken.make(token))
          .pipe(
            Effect.catchTag("UserErrorNotFoundWithAccessToken", () =>
              Effect.fail(
                new ActorErrorUnauthorized({
                  actorId: UserId.make(-1),
                  entity: "",
                  action: ""
                })
              )),
            Effect.flatMap(Effect.succeed),
            Effect.withSpan("MiddlewareAuthentication", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "cookie", token } })
          )
    })
  })
)
