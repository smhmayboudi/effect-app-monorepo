import type { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import type { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Context, type Effect } from "effect"

export class PersonPortDriven extends Context.Tag("PersonPortDriven")<PersonPortDriven, {
  create: (person: Omit<Person, "id" | "createdAt" | "updatedAt">) => Effect.Effect<PersonId, never, never>
  delete: (id: PersonId) => Effect.Effect<PersonId, PersonErrorNotFound, never>
  readAll: (urlParams: URLParams<Person>) => Effect.Effect<Array<Person>, never, never>
  readById: (id: PersonId) => Effect.Effect<Person, PersonErrorNotFound, never>
  update: (
    id: PersonId,
    person: Partial<Omit<Person, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<PersonId, PersonErrorNotFound, never>
}>() {}
