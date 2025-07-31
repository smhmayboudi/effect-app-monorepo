import { Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainUserCurrent } from "@template/domain/user/application/domain-user"
import { TodoId } from "@template/domain/todo/application/domain-todo"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"
import { PortTodoPolicy } from "../application/todo-policy.js"

export const TodoPolicy = Layer.effect(
  PortTodoPolicy,
  Effect.gen(function* () {
    const canCreate = (id: TodoId): Effect.Effect<ActorAuthorized<"Todo", "create">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Todo", "create", (actor) => Effect.succeed(true))

    const canDelete = (id: TodoId): Effect.Effect<ActorAuthorized<"Todo", "delete">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Todo", "delete", (actor) => Effect.succeed(true))

    const canReadAll = (id: TodoId): Effect.Effect<ActorAuthorized<"Todo", "readAll">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Todo", "readAll", (actor) => Effect.succeed(true))

    const canReadById = (id: TodoId): Effect.Effect<ActorAuthorized<"Todo", "readById">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Todo", "readById", (actor) => Effect.succeed(true))

    const canUpdate = (id: TodoId): Effect.Effect<ActorAuthorized<"Todo", "update">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Todo", "update", (actor) => Effect.succeed(true))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadById,
      canUpdate
    } as const
  })
)
