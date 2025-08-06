import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import type { PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import { Context, type Effect } from "effect"

export class PortPersonPolicy extends Context.Tag("PortPersonPolicy")<PortPersonPolicy, {
  canCreate: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "create">, ActorErrorUnauthorized, Actor>
  canDelete: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "delete">, ActorErrorUnauthorized, Actor>
  canReadAll: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "readAll">, ActorErrorUnauthorized, Actor>
  canReadById: (
    id: PersonId
  ) => Effect.Effect<ActorAuthorized<"Person", "readById">, ActorErrorUnauthorized, Actor>
  canUpdate: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "update">, ActorErrorUnauthorized, Actor>
}>() {}
