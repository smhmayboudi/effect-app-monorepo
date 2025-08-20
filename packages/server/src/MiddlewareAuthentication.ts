import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { ActorErrorUnauthorized } from "@template/domain/Actor"
import { PortMiddlewareAuthentication } from "@template/domain/PortMiddlewareAuthentication"
import { AccessToken, UserId } from "@template/domain/user/application/UserApplicationDomain"
import { Effect, Layer } from "effect"
import { UserPortDriving } from "./domain/user/application/UserApplicationPortDriving.js"
import { withSystemActor } from "./util/Policy.js"

export const MiddlewareAuthentication = Layer.effect(
  PortMiddlewareAuthentication,
  Effect.gen(function*() {
    const user = yield* UserPortDriving

    return PortMiddlewareAuthentication.of({
      cookie: (token) =>
        user.readByAccessToken(AccessToken.make(token)).pipe(
          Effect.catchTag("UserErrorNotFoundWithAccessToken", () =>
            Effect.fail(
              new ActorErrorUnauthorized({
                actorId: UserId.make(-1),
                entity: "",
                action: ""
              })
            )),
          Effect.flatMap(Effect.succeed),
          Effect.withSpan("PortMiddlewareAuthentication", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "cookie", token }
          }),
          withSystemActor
        )
    })
  })
)
