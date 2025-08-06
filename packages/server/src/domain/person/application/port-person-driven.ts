import type { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import type { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import { Context, type Effect } from "effect"

export class PortPersonDriven extends Context.Tag("PortPersonDriven")<PortPersonDriven, {
  create: (person: Omit<Person, "id" | "createdAt" | "updatedAt">) => Effect.Effect<PersonId, never, never>
  delete: (id: PersonId) => Effect.Effect<PersonId, PersonErrorNotFound, never>
  readAll: () => Effect.Effect<Array<Person>, never, never>
  readById: (id: PersonId) => Effect.Effect<Person, PersonErrorNotFound, never>
  update: (
    id: PersonId,
    person: Partial<Omit<Person, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<PersonId, PersonErrorNotFound, never>
}>() {}
