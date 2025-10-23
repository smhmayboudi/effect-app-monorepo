import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import type { TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"

export class TodoPortPolicy extends Context.Tag("TodoPortPolicy")<TodoPortPolicy, {
  canCreate: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "create">, ActorErrorUnauthorized, Actor>
  canDelete: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "delete">, ActorErrorUnauthorized, Actor>
  canReadAll: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "readAll">, ActorErrorUnauthorized, Actor>
  canReadById: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "readById">, ActorErrorUnauthorized, Actor>
  canUpdate: (id: TodoId) => Effect.Effect<ActorAuthorized<"Todo", "update">, ActorErrorUnauthorized, Actor>
}>() {}
