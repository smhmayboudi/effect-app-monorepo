import type { ActorAuthorized, DomainActor, ErrorActorUnauthorized } from "@template/domain/actor"
import type { TodoId } from "@template/domain/todo/application/domain-todo"
import { Context, type Effect } from "effect"

export class PortTodoPolicy extends Context.Tag("PortTodoPolicy")<PortTodoPolicy, {
  canCreate: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "create">, ErrorActorUnauthorized, DomainActor>
  canDelete: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "delete">, ErrorActorUnauthorized, DomainActor>
  canReadAll: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "readAll">, ErrorActorUnauthorized, DomainActor>
  canReadById: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "readById">, ErrorActorUnauthorized, DomainActor>
  canUpdate: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "update">, ErrorActorUnauthorized, DomainActor>
}>() {}
