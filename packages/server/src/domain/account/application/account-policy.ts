import { Context, Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainUserCurrent } from "@template/domain/user/application/domain-user"
import { AccountId } from "@template/domain/account/application/domain-account"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortAccountPolicy extends Context.Tag("PortAccountPolicy")<PortAccountPolicy, {
  canCreate: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "create">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadAll: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "readAll">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadById: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "readById">, ErrorActorUnauthorized, DomainUserCurrent>
  canUpdate: (id: AccountId) => Effect.Effect<ActorAuthorized<"Account", "update">, ErrorActorUnauthorized, DomainUserCurrent>
}>() {}

export const AccountPolicy = Layer.effect(
  PortAccountPolicy,
  Effect.gen(function* () {
    const canCreate = (id: AccountId): Effect.Effect<ActorAuthorized<"Account", "create">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Account", "create", (actor) => Effect.succeed(true))

    const canDelete = (id: AccountId): Effect.Effect<ActorAuthorized<"Account", "delete">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Account", "delete", (actor) => Effect.succeed(true))

    const canReadAll = (id: AccountId): Effect.Effect<ActorAuthorized<"Account", "readAll">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Account", "readAll", (actor) => Effect.succeed(true))

    const canReadById = (id: AccountId): Effect.Effect<ActorAuthorized<"Account", "readById">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Account", "readById", (actor) => Effect.succeed(true))

    const canUpdate = (id: AccountId): Effect.Effect<ActorAuthorized<"Account", "update">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Account", "update", (actor) => Effect.succeed(true))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadById,
      canUpdate
    } as const
  })
)
