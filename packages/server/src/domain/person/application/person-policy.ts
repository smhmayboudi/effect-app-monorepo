import { Context, Effect } from "effect"
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
