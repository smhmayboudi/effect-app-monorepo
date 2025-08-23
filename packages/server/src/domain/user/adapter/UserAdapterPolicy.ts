import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Effect, Layer } from "effect"
import { policy } from "../../../util/Policy.js"
import { UserPortPolicy } from "../application/UserApplicationPortPolicy.js"

export const UserPolicy = Layer.effect(
  UserPortPolicy,
  Effect.sync(() =>
    UserPortPolicy.of({
      canCreate: (id) =>
        policy("User", "create", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("UserPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
          )),
      canDelete: (id) =>
        policy("User", "delete", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("UserPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
          )),
      canReadAll: (id) =>
        policy("User", "readAll", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("UserPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
          )),
      canReadByAccessToken: (id) =>
        policy("User", "readByAccessToken", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("UserPolicy", {
              attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadByAccessToken", id, actor }
            })
          )),
      canReadById: (id) =>
        policy("User", "readById", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("UserPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
          )),
      canReadByIdWithSensitive: (id) =>
        policy("User", "readByIdWithSensitive", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("UserPolicy", {
              attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadByIdWithSensitive", id, actor }
            })
          )),
      canUpdate: (id) =>
        policy("User", "update", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("UserPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
          ))
    })
  )
)
