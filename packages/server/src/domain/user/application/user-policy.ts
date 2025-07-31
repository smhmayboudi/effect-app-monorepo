import { Context, Effect } from "effect"
import { UserId } from "@template/domain/user/application/domain-user"
import { DomainActor } from "@template/domain/actor"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortUserPolicy extends Context.Tag("PortUserPolicy")<PortUserPolicy, {
  canCreate: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "create">, ErrorActorUnauthorized, DomainActor>
  canDelete: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "delete">, ErrorActorUnauthorized, DomainActor>
  canReadAll: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "readAll">, ErrorActorUnauthorized, DomainActor>
  canReadById: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "readById">, ErrorActorUnauthorized, DomainActor>
  canReadByIdWithSensitive: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "readByIdWithSensitive">, ErrorActorUnauthorized, DomainActor>
  canUpdate: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "update">, ErrorActorUnauthorized, DomainActor>
}>() {}
