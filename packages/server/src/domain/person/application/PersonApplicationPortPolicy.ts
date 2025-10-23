import type { Actor, ActorAuthorized, ActorErrorUnauthorized } from "@template/domain/Actor"
import type { PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"

export class PersonPortPolicy extends Context.Tag("PersonPortPolicy")<PersonPortPolicy, {
  canCreate: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "create">, ActorErrorUnauthorized, Actor>
  canDelete: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "delete">, ActorErrorUnauthorized, Actor>
  canReadAll: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "readAll">, ActorErrorUnauthorized, Actor>
  canReadById: (
    id: PersonId
  ) => Effect.Effect<ActorAuthorized<"Person", "readById">, ActorErrorUnauthorized, Actor>
  canUpdate: (id: PersonId) => Effect.Effect<ActorAuthorized<"Person", "update">, ActorErrorUnauthorized, Actor>
}>() {}
