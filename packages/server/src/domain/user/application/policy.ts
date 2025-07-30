import { Context, Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainUserCurrent, UserId } from "@template/domain/user/application/domain-user"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortAccountPolicy extends Context.Tag("PortAccountPolicy")<PortAccountPolicy, {
  canCreate: (id: UserId) => Effect.Effect<ActorAuthorized<"DomainUser", "create">, ErrorActorUnauthorized, DomainUserCurrent>
  canDelete: (id: UserId) => Effect.Effect<ActorAuthorized<"DomainUser", "delete">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadAll: (id: UserId) => Effect.Effect<ActorAuthorized<"DomainUser", "readAll">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadByAccessToken: (id: UserId) => Effect.Effect<ActorAuthorized<"DomainUser", "readByAccessToken">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadById: (id: UserId) => Effect.Effect<ActorAuthorized<"DomainUser", "readById">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadByMe: (id: UserId) => Effect.Effect<ActorAuthorized<"DomainUser", "readByMe">, ErrorActorUnauthorized, DomainUserCurrent>
  canUpdate: (id: UserId) => Effect.Effect<ActorAuthorized<"DomainUser", "update">, ErrorActorUnauthorized, DomainUserCurrent>
}>() {}

export const AccountPolicy = Layer.effect(
  PortAccountPolicy,
  Effect.gen(function* () {
    const canCreate = (id: UserId): Effect.Effect<ActorAuthorized<"DomainUser", "create">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DomainUser", "create", (actor) => Effect.succeed(true))

    const canDelete = (id: UserId): Effect.Effect<ActorAuthorized<"DomainUser", "delete">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DomainUser", "delete", (actor) => Effect.succeed(actor.id === id))

    const canReadAll = (id: UserId): Effect.Effect<ActorAuthorized<"DomainUser", "readAll">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DomainUser", "readAll", (actor) => Effect.succeed(true))

    const canReadByAccessToken = (id: UserId): Effect.Effect<ActorAuthorized<"DomainUser", "readByAccessToken">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DomainUser", "readByAccessToken", (actor) => Effect.succeed(actor.id === id))

    const canReadById = (id: UserId): Effect.Effect<ActorAuthorized<"DomainUser", "readById">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DomainUser", "readById", (actor) => Effect.succeed(actor.id === id))

    const canReadByMe = (id: UserId): Effect.Effect<ActorAuthorized<"DomainUser", "readByMe">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DomainUser", "readByMe", (actor) => Effect.succeed(actor.id === id))

    const canUpdate = (id: UserId): Effect.Effect<ActorAuthorized<"DomainUser", "update">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DomainUser", "update", (actor) => Effect.succeed(actor.id === id))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadByAccessToken,
      canReadById,
      canReadByMe,
      canUpdate
    } as const
  })
)
