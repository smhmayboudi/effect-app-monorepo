import { Context, Effect } from "effect"
import { ErrorPersonNotFound } from "@template/domain/person/application/error-person-not-found"
import { DomainPerson, PersonId } from "@template/domain/person/application/domain-person"

export class PortPersonDriven extends Context.Tag("PortPersonDriven")<PortPersonDriven, {
  create: (person: Omit<DomainPerson, "id">) => Effect.Effect<PersonId, never, never>
  delete: (id: PersonId) => Effect.Effect<void, ErrorPersonNotFound, never>
  readAll: () => Effect.Effect<DomainPerson[], never, never>
  readById: (id: PersonId) => Effect.Effect<DomainPerson, ErrorPersonNotFound, never>
  update: (id: PersonId, person: Partial<Omit<DomainPerson, "id">>) => Effect.Effect<void, ErrorPersonNotFound, never>
}>() {}
