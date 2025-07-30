import { Context, Effect } from "effect"
import { ErrorPersonNotFound } from "@template/domain/person/application/error-person-not-found"
import { DomainPerson, PersonId } from "@template/domain/person/application/domain-person"
import { ActorAuthorized } from "@template/domain/actor"

export class PortPersonDriving extends Context.Tag("PortPersonDriving")<PortPersonDriving, {
  create: (person: Omit<DomainPerson, "id" | "createdAt" | "updatedAt">) => Effect.Effect<PersonId, never, ActorAuthorized<"Person", "create">>
  delete: (id: PersonId) => Effect.Effect<PersonId, ErrorPersonNotFound, ActorAuthorized<"Person", "delete">>
  readAll: () => Effect.Effect<DomainPerson[], never, ActorAuthorized<"Person", "readAll">>
  readById: (id: PersonId) => Effect.Effect<DomainPerson, ErrorPersonNotFound, ActorAuthorized<"Person", "readById">>
  update: (id: PersonId, person: Partial<Omit<DomainPerson, "id">>) => Effect.Effect<PersonId, ErrorPersonNotFound, ActorAuthorized<"Person", "update">>
}>() {}
