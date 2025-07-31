import { Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainUserCurrent, UserId } from "@template/domain/user/application/domain-user"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"
import { PortUserPolicy } from "../application/user-policy.js"

export const UserPolicy = Layer.effect(
  PortUserPolicy,
  Effect.gen(function* () {
    const canCreate = (id: UserId): Effect.Effect<ActorAuthorized<"User", "create">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("User", "create", (actor) => Effect.succeed(true))

    const canDelete = (id: UserId): Effect.Effect<ActorAuthorized<"User", "delete">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("User", "delete", (actor) => Effect.succeed(true))

    const canReadAll = (id: UserId): Effect.Effect<ActorAuthorized<"User", "readAll">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("User", "readAll", (actor) => Effect.succeed(true))

    const canReadById = (id: UserId): Effect.Effect<ActorAuthorized<"User", "readById">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("User", "readById", (actor) => Effect.succeed(true))

    const canReadByMe = (id: UserId): Effect.Effect<ActorAuthorized<"User", "readByMe">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("User", "readByMe", (actor) => Effect.succeed(true))

    const canUpdate = (id: UserId): Effect.Effect<ActorAuthorized<"User", "update">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("User", "update", (actor) => Effect.succeed(true))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadById,
      canReadByMe,
      canUpdate
    } as const
  })
)
