import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Effect, Layer } from "effect"
import { policy } from "../../../util/Policy.js"
import { AccountPortPolicy } from "../application/AccountApplicationPortPolicy.js"

export const AccountPolicy = Layer.effect(
  AccountPortPolicy,
  Effect.sync(() =>
    AccountPortPolicy.of({
      canCreate: (id) =>
        policy("Account", "create", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
          )),
      canDelete: (id) =>
        policy("Account", "delete", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
          )),
      canReadAll: (id) =>
        policy("Account", "readAll", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
          )),
      canReadById: (id) =>
        policy("Account", "readById", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
          )),
      canUpdate: (id) =>
        policy("Account", "update", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("AccountPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
          ))
    })
  )
)
