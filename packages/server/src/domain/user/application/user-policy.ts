import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import type { UserId } from "@template/domain/user/application/UserApplicationDomain"
import { Context, type Effect } from "effect"

export class PortUserPolicy extends Context.Tag("PortUserPolicy")<PortUserPolicy, {
  canCreate: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "create">, ActorErrorUnauthorized, Actor>
  canDelete: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "delete">, ActorErrorUnauthorized, Actor>
  canReadAll: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "readAll">, ActorErrorUnauthorized, Actor>
  canReadById: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "readById">, ActorErrorUnauthorized, Actor>
  canReadByIdWithSensitive: (
    id: UserId
  ) => Effect.Effect<ActorAuthorized<"User", "readByIdWithSensitive">, ActorErrorUnauthorized, Actor>
  canUpdate: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "update">, ActorErrorUnauthorized, Actor>
}>() {}
