import { Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainActor } from "@template/domain/actor"
import { PersonId } from "@template/domain/person/application/domain-person"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"
import { PortPersonPolicy } from "../application/person-policy.js"

export const PersonPolicy = Layer.effect(
  PortPersonPolicy,
  Effect.gen(function* () {
    const canCreate = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "create">, ErrorActorUnauthorized, DomainActor> =>
      policy("Person", "create", (actor) => Effect.succeed(true))

    const canDelete = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "delete">, ErrorActorUnauthorized, DomainActor> =>
      policy("Person", "delete", (actor) => Effect.succeed(true))

    const canReadAll = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "readAll">, ErrorActorUnauthorized, DomainActor> =>
      policy("Person", "readAll", (actor) => Effect.succeed(true))

    const canReadById = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "readById">, ErrorActorUnauthorized, DomainActor> =>
      policy("Person", "readById", (actor) => Effect.succeed(true))

    const canUpdate = (id: PersonId): Effect.Effect<ActorAuthorized<"Person", "update">, ErrorActorUnauthorized, DomainActor> =>
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
