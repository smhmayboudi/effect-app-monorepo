import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { policy } from "../../../util/Policy.js"
import { PersonPortPolicy } from "../application/PersonApplicationPortPolicy.js"

export const PersonPolicy = Layer.succeed(
  PersonPortPolicy,
  PersonPortPolicy.of({
    canCreate: (id) =>
      policy("Person", "create", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
        )),
    canDelete: (id) =>
      policy("Person", "delete", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
        )),
    canReadAll: (id) =>
      policy("Person", "readAll", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
        )),
    canReadById: (id) =>
      policy("Person", "readById", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
        )),
    canUpdate: (id) =>
      policy("Person", "update", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("PersonPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
        ))
  })
)
