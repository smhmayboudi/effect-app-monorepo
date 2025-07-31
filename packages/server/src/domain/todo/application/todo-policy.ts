import { Context, Effect } from "effect"
import { DomainUserCurrent } from "@template/domain/user/application/domain-user"
import { TodoId } from "@template/domain/todo/application/domain-todo"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortTodoPolicy extends Context.Tag("PortTodoPolicy")<PortTodoPolicy, {
  canCreate: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "create">, ErrorActorUnauthorized, DomainUserCurrent>
  canDelete: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "delete">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadAll: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "readAll">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadById: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "readById">, ErrorActorUnauthorized, DomainUserCurrent>
  canUpdate: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "update">, ErrorActorUnauthorized, DomainUserCurrent>
}>() {}
