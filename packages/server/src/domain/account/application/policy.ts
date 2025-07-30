import { Context, Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainUserCurrent } from "@template/domain/user/application/domain-user"
import { DomainAccount } from "@template/domain/account/application/domain-account"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortAccountPolicy extends Context.Tag("PortAccountPolicy")<PortAccountPolicy, {
  canCreate: (account: DomainAccount) => Effect.Effect<ActorAuthorized<"DmainAccount", "create">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadAll: (account: DomainAccount) => Effect.Effect<ActorAuthorized<"DmainAccount", "readAll">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadById: (account: DomainAccount) => Effect.Effect<ActorAuthorized<"DmainAccount", "readById">, ErrorActorUnauthorized, DomainUserCurrent>
  canUpdate: (account: DomainAccount) => Effect.Effect<ActorAuthorized<"DmainAccount", "update">, ErrorActorUnauthorized, DomainUserCurrent>
}>() {}

export const AccountPolicy = Layer.effect(
  PortAccountPolicy,
  Effect.gen(function* () {
    const canCreate = (account: DomainAccount): Effect.Effect<ActorAuthorized<"DmainAccount", "create">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainAccount", "create", (actor) => Effect.succeed(true))

    const canDelete = (account: DomainAccount): Effect.Effect<ActorAuthorized<"DmainAccount", "delete">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainAccount", "delete", (actor) => Effect.succeed(true))

    const canReadAll = (account: DomainAccount): Effect.Effect<ActorAuthorized<"DmainAccount", "readAll">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainAccount", "readAll", (actor) => Effect.succeed(true))

    const canReadById = (account: DomainAccount): Effect.Effect<ActorAuthorized<"DmainAccount", "readById">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainAccount", "readById", (actor) => Effect.succeed(true))

    const canUpdate = (account: DomainAccount): Effect.Effect<ActorAuthorized<"DmainAccount", "update">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainAccount", "update", (actor) => Effect.succeed(true))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadById,
      canUpdate
    } as const
  })
)
