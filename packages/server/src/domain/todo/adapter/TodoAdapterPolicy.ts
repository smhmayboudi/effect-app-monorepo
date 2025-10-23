import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { policy } from "../../../util/Policy.js"
import { TodoPortPolicy } from "../application/TodoApplicationPortPolicy.js"

export const TodoPolicy = Layer.succeed(
  TodoPortPolicy,
  TodoPortPolicy.of({
    canCreate: (id) =>
      policy("Todo", "create", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
        )),
    canDelete: (id) =>
      policy("Todo", "delete", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
        )),
    canReadAll: (id) =>
      policy("Todo", "readAll", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
        )),
    canReadById: (id) =>
      policy("Todo", "readById", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
        )),
    canUpdate: (id) =>
      policy("Todo", "update", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
        ))
  })
)
