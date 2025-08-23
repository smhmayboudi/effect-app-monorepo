import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Effect, Layer } from "effect"
import { policy } from "../../../util/Policy.js"
import { VWPortPolicy } from "../application/VWApplicationPortPolicy.js"

export const VWPolicy = Layer.effect(
  VWPortPolicy,
  Effect.sync(() => ({
    canReadAllUserGroupPerson: () =>
      policy("VW", "readAllUserGroupPerson", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("VWPolicy", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAllUserGroupPerson", actor }
          })
        )),
    canReadAllUserTodo: () =>
      policy("VW", "readAllUserTodo", (actor) =>
        Effect.succeed(true).pipe(
          Effect.withSpan("VWPolicy", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAllUserTodo", actor }
          })
        ))
  }))
)
