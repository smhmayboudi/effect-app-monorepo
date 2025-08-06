import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import type { TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import { Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { PortTodoPolicy } from "../application/todo-policy.js"

const canCreate = (
  id: TodoId
): Effect.Effect<ActorAuthorized<"Todo", "create">, ActorErrorUnauthorized, Actor> =>
  policy("Todo", "create", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
    ))

const canDelete = (
  id: TodoId
): Effect.Effect<ActorAuthorized<"Todo", "delete">, ActorErrorUnauthorized, Actor> =>
  policy("Todo", "delete", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
    ))

const canReadAll = (
  id: TodoId
): Effect.Effect<ActorAuthorized<"Todo", "readAll">, ActorErrorUnauthorized, Actor> =>
  policy("Todo", "readAll", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
    ))

const canReadById = (
  id: TodoId
): Effect.Effect<ActorAuthorized<"Todo", "readById">, ActorErrorUnauthorized, Actor> =>
  policy("Todo", "readById", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
    ))

const canUpdate = (
  id: TodoId
): Effect.Effect<ActorAuthorized<"Todo", "update">, ActorErrorUnauthorized, Actor> =>
  policy("Todo", "update", (actor) =>
    Effect.succeed(true).pipe(
      Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
    ))

export const TodoPolicy = Layer.effect(
  PortTodoPolicy,
  Effect.sync(() => ({
    canCreate,
    canDelete,
    canReadAll,
    canReadById,
    canUpdate
  }))
)
