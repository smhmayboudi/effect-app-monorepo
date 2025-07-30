import { Context, Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainUserCurrent } from "@template/domain/user/application/domain-user"
import { PersonId } from "@template/domain/person/application/domain-person"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortPersonPolicy extends Context.Tag("PortPersonPolicy")<PortPersonPolicy, {
  canCreate: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "create">, ErrorActorUnauthorized, DomainUserCurrent>
  canDelete: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "delete">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadAll: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "readAll">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadById: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "readById">, ErrorActorUnauthorized, DomainUserCurrent>
  canUpdate: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "update">, ErrorActorUnauthorized, DomainUserCurrent>
}>() {}

export const PersonPolicy = Layer.effect(
  PortPersonPolicy,
  Effect.gen(function* () {
    const canCreate = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "create">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Person", "create", (actor) => Effect.succeed(true))

    const canDelete = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "delete">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Person", "delete", (actor) => Effect.succeed(true))

    const canReadAll = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "readAll">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Person", "readAll", (actor) => Effect.succeed(true))

    const canReadById = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "readById">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Person", "readById", (actor) => Effect.succeed(true))

    const canUpdate = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "update">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("Person", "update", (actor) => Effect.succeed(true))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadById,
      canUpdate
    } as const
  })
)
