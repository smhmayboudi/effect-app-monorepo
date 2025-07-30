import { Context, Effect, Layer } from "effect"
import { policy } from "../../../util/policy.js"
import { DomainUserCurrent } from "@template/domain/user/application/domain-user"
import { DomainPerson } from "@template/domain/person/application/domain-person"
import { ActorAuthorized, ErrorActorUnauthorized } from "@template/domain/actor"

export class PortPersonPolicy extends Context.Tag("PortPersonPolicy")<PortPersonPolicy, {
  canCreate: (person: DomainPerson) => Effect.Effect<ActorAuthorized<"DmainPerson", "create">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadAll: (person: DomainPerson) => Effect.Effect<ActorAuthorized<"DmainPerson", "readAll">, ErrorActorUnauthorized, DomainUserCurrent>
  canReadById: (person: DomainPerson) => Effect.Effect<ActorAuthorized<"DmainPerson", "readById">, ErrorActorUnauthorized, DomainUserCurrent>
  canUpdate: (person: DomainPerson) => Effect.Effect<ActorAuthorized<"DmainPerson", "update">, ErrorActorUnauthorized, DomainUserCurrent>
}>() {}

export const PersonPolicy = Layer.effect(
  PortPersonPolicy,
  Effect.gen(function* () {
    const canCreate = (person: DomainPerson): Effect.Effect<ActorAuthorized<"DmainPerson", "create">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainPerson", "create", (actor) => Effect.succeed(true))

    const canDelete = (person: DomainPerson): Effect.Effect<ActorAuthorized<"DmainPerson", "delete">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainPerson", "delete", (actor) => Effect.succeed(true))

    const canReadAll = (person: DomainPerson): Effect.Effect<ActorAuthorized<"DmainPerson", "readAll">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainPerson", "readAll", (actor) => Effect.succeed(true))

    const canReadById = (person: DomainPerson): Effect.Effect<ActorAuthorized<"DmainPerson", "readById">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainPerson", "readById", (actor) => Effect.succeed(true))

    const canUpdate = (person: DomainPerson): Effect.Effect<ActorAuthorized<"DmainPerson", "update">, ErrorActorUnauthorized, DomainUserCurrent> =>
      policy("DmainPerson", "update", (actor) => Effect.succeed(true))

    return {
      canCreate,
      canDelete,
      canReadAll,
      canReadById,
      canUpdate
    } as const
  })
)
