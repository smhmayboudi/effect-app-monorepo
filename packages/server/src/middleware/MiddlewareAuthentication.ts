import { HttpServerRequest } from "@effect/platform"
import { NodeHttpServerRequest } from "@effect/platform-node"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { ActorErrorUnauthorized, ActorId } from "@template/domain/Actor"
import { PortMiddlewareAuthentication } from "@template/domain/PortMiddlewareAuthentication"
import { ServiceId } from "@template/domain/service/application/ServiceApplicationDomain"
import { Effect, Layer, Option, Redacted } from "effect"
import { AuthenticationPortDriving } from "../domain/authentication/application/AuthenticationApplicationPortDriving.js"
import { withSystemActor } from "../util/Policy.js"

export const MiddlewareAuthentication = Layer.effect(
  PortMiddlewareAuthentication,
  AuthenticationPortDriving.pipe(
    Effect.flatMap((authF) =>
      Effect.sync(() =>
        PortMiddlewareAuthentication.of({
          cookie: (token) =>
            HttpServerRequest.HttpServerRequest.pipe(
              Effect.flatMap((request) =>
                authF(ServiceId.make("00000000-0000-0000-0000-000000000000")).call((client) =>
                  client.api.getSession({
                    headers: new Headers(
                      NodeHttpServerRequest.toIncomingMessage(request).headers as Record<string, string>
                    )
                  })
                )
              ),
              Effect.flatMap((session) =>
                Option.fromNullable(session).pipe(
                  Option.match({
                    onNone: () =>
                      Effect.fail(
                        new ActorErrorUnauthorized({
                          actorId: ActorId.make("00000000-0000-0000-0000-000000000000"),
                          entity: "",
                          action: ""
                        })
                      ),
                    onSome: (a) => Effect.succeed(a.user)
                  })
                )
              ),
              Effect.catchTag("AuthenticationError", () =>
                Effect.fail(
                  new ActorErrorUnauthorized({
                    actorId: ActorId.make("00000000-0000-0000-0000-000000000000"),
                    entity: "",
                    action: ""
                  })
                )),
              Effect.withSpan("MiddlewareAuthentication", {
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "cookie", token: Redacted.value(token) }
              }),
              withSystemActor
            )
        })
      )
    )
  )
)
