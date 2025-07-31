import { Context, Effect } from "effect"
import { DomainUserCurrent, UserId } from "@template/domain/user/application/domain-user"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortUserPolicy extends Context.Tag("PortUserPolicy")<PortUserPolicy, {
  canCreate: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "create">, ErrorActorUnauthorized, DomainUserCurrent>
  canDelete: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "delete">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadAll: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "readAll">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadById: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "readById">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadByMe: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "readByMe">, ErrorActorUnauthorized, DomainUserCurrent>
  canUpdate: (id: UserId) => Effect.Effect<ActorAuthorized<"User", "update">, ErrorActorUnauthorized, DomainUserCurrent>
}>() {}
