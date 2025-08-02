import type { ActorAuthorized, DomainActor, ErrorActorUnauthorized } from "@template/domain/actor"
import type { PersonId } from "@template/domain/person/application/domain-person"
import { Context, type Effect } from "effect"

export class PortPersonPolicy extends Context.Tag("PortPersonPolicy")<PortPersonPolicy, {
  canCreate: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "create">, ErrorActorUnauthorized, DomainActor>
  canDelete: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "delete">, ErrorActorUnauthorized, DomainActor>
  canReadAll: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "readAll">, ErrorActorUnauthorized, DomainActor>
  canReadById: (
    id: PersonId
  ) => Effect.Effect<ActorAuthorized<"Person", "readById">, ErrorActorUnauthorized, DomainActor>
  canUpdate: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "update">, ErrorActorUnauthorized, DomainActor>
}>() {}
