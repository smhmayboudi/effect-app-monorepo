import { Context, Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainUserCurrent } from "@template/domain/user/application/domain-user"
import { DomainGroup } from "@template/domain/group/application/domain-group"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortAccountPolicy extends Context.Tag("PortAccountPolicy")<PortAccountPolicy, {
  canCreate: (group: DomainGroup) => Effect.Effect<ActorAuthorized<"DmainGroup", "create">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadAll: (group: DomainGroup) => Effect.Effect<ActorAuthorized<"DmainGroup", "readAll">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadById: (group: DomainGroup) => Effect.Effect<ActorAuthorized<"DmainGroup", "readById">, ErrorActorUnauthorized, DomainUserCurrent>
  canUpdate: (group: DomainGroup) => Effect.Effect<ActorAuthorized<"DmainGroup", "update">, ErrorActorUnauthorized, DomainUserCurrent>
}>() {}

export const AccountPolicy = Layer.effect(
  PortAccountPolicy,
  Effect.gen(function* () {
    const canCreate = (group: DomainGroup): Effect.Effect<ActorAuthorized<"DmainGroup", "create">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainGroup", "create", (actor) => Effect.succeed(true))

    const canDelete = (group: DomainGroup): Effect.Effect<ActorAuthorized<"DmainGroup", "delete">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainGroup", "delete", (actor) => Effect.succeed(true))

    const canReadAll = (group: DomainGroup): Effect.Effect<ActorAuthorized<"DmainGroup", "readAll">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainGroup", "readAll", (actor) => Effect.succeed(true))

    const canReadById = (group: DomainGroup): Effect.Effect<ActorAuthorized<"DmainGroup", "readById">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainGroup", "readById", (actor) => Effect.succeed(true))

    const canUpdate = (group: DomainGroup): Effect.Effect<ActorAuthorized<"DmainGroup", "update">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainGroup", "update", (actor) => Effect.succeed(actor.ownerId === group.ownerId))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadById,
      canUpdate
    } as const
  })
)
