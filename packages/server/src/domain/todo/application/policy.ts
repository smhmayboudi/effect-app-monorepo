import { Context, Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainUserCurrent } from "@template/domain/user/application/domain-user"
import { DomainTodo } from "@template/domain/todo/application/domain-todo"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortTodoPolicy extends Context.Tag("PortTodoPolicy")<PortTodoPolicy, {
  canCreate: (todo: DomainTodo) => Effect.Effect<ActorAuthorized<"DmainTodo", "create">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadAll: (todo: DomainTodo) => Effect.Effect<ActorAuthorized<"DmainTodo", "readAll">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadById: (todo: DomainTodo) => Effect.Effect<ActorAuthorized<"DmainTodo", "readById">, ErrorActorUnauthorized, DomainUserCurrent>
  canUpdate: (todo: DomainTodo) => Effect.Effect<ActorAuthorized<"DmainTodo", "update">, ErrorActorUnauthorized, DomainUserCurrent>
}>() {}

export const TodoPolicy = Layer.effect(
  PortTodoPolicy,
  Effect.gen(function* () {
    const canCreate = (todo: DomainTodo): Effect.Effect<ActorAuthorized<"DmainTodo", "create">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainTodo", "create", (actor) => Effect.succeed(true))

    const canDelete = (todo: DomainTodo): Effect.Effect<ActorAuthorized<"DmainTodo", "delete">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainTodo", "delete", (actor) => Effect.succeed(true))

    const canReadAll = (todo: DomainTodo): Effect.Effect<ActorAuthorized<"DmainTodo", "readAll">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainTodo", "readAll", (actor) => Effect.succeed(true))

    const canReadById = (todo: DomainTodo): Effect.Effect<ActorAuthorized<"DmainTodo", "readById">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainTodo", "readById", (actor) => Effect.succeed(true))

    const canUpdate = (todo: DomainTodo): Effect.Effect<ActorAuthorized<"DmainTodo", "update">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainTodo", "update", (actor) => Effect.succeed(true))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadById,
      canUpdate
    } as const
  })
)
