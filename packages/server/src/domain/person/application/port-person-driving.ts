import type { ActorAuthorized } from "@template/domain/actor"
import type { ErrorGroupNotFound } from "@template/domain/group/application/error-group-not-found"
import type { DomainPerson, PersonId } from "@template/domain/person/application/domain-person"
import type { ErrorPersonNotFound } from "@template/domain/person/application/error-person-not-found"
import { Context, type Effect } from "effect"

export class PortPersonDriving extends Context.Tag("PortPersonDriving")<PortPersonDriving, {
  create: (
    person: Omit<DomainPerson, "id" | "createdAt" | "updatedAt">
  ) => Effect.Effect<
    PersonId,
    ErrorGroupNotFound,
    ActorAuthorized<"Person", "create"> | ActorAuthorized<"Group", "readById">
  >
  delete: (id: PersonId) => Effect.Effect<PersonId, ErrorPersonNotFound, ActorAuthorized<"Person", "delete">>
  readAll: () => Effect.Effect<Array<DomainPerson>, never, ActorAuthorized<"Person", "readAll">>
  readById: (id: PersonId) => Effect.Effect<DomainPerson, ErrorPersonNotFound, ActorAuthorized<"Person", "readById">>
  update: (
    id: PersonId,
    person: Partial<Omit<DomainPerson, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<PersonId, ErrorPersonNotFound, ActorAuthorized<"Person", "update">>
}>() {}
