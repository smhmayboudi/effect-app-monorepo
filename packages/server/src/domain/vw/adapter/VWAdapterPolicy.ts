import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import { Effect, Layer } from "effect"
import { policy } from "../../../util/Policy.js"
import { VWPortPolicy } from "../application/VWApplicationPortPolicy.js"

const canReadAllUserGroupPerson = (): Effect.Effect<
  ActorAuthorized<"VW", "readAllUserGroupPerson">,
  ActorErrorUnauthorized,
  Actor
> =>
  policy("VW", "readAllUserGroupPerson", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("VWPolicy", {
        attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAllUserGroupPerson", actor }
      })
    ))

const canReadAllUserTodo = (): Effect.Effect<
  ActorAuthorized<"VW", "readAllUserTodo">,
  ActorErrorUnauthorized,
  Actor
> =>
  policy("VW", "readAllUserTodo", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("VWPolicy", {
        attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAllUserTodo", actor }
      })
    ))

export const VWPolicy = Layer.effect(
  VWPortPolicy,
  Effect.sync(() => ({
    canReadAllUserGroupPerson,
    canReadAllUserTodo
  }))
)
