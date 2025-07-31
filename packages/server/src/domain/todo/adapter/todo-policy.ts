import { Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainActor } from "@template/domain/actor"
import { TodoId } from "@template/domain/todo/application/domain-todo"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"
import { PortTodoPolicy } from "../application/todo-policy.js"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"

export const TodoPolicy = Layer.effect(
  PortTodoPolicy,
  Effect.gen(function* () {
    const canCreate = (id: TodoId): Effect.Effect<ActorAuthorized<"Todo", "create">, ErrorActorUnauthorized, DomainActor> =>
      policy("Todo", "create", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor }})
      ))

    const canDelete = (id: TodoId): Effect.Effect<ActorAuthorized<"Todo", "delete">, ErrorActorUnauthorized, DomainActor> =>
      policy("Todo", "delete", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor }})
      ))

    const canReadAll = (id: TodoId): Effect.Effect<ActorAuthorized<"Todo", "readAll">, ErrorActorUnauthorized, DomainActor> =>
      policy("Todo", "readAll", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor }})
      ))

    const canReadById = (id: TodoId): Effect.Effect<ActorAuthorized<"Todo", "readById">, ErrorActorUnauthorized, DomainActor> =>
      policy("Todo", "readById", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor }})
      ))

    const canUpdate = (id: TodoId): Effect.Effect<ActorAuthorized<"Todo", "update">, ErrorActorUnauthorized, DomainActor> =>
      policy("Todo", "update", (actor) => Effect.succeed(true).pipe(
        Effect.withSpan("TodoPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor }})
      ))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadById,
      canUpdate
    } as const
  })
)
