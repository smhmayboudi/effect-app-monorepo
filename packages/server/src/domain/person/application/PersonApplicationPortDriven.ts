import type { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import type { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"

export class PersonPortDriven extends Context.Tag("PersonPortDriven")<PersonPortDriven, {
  create: (person: Omit<Person, "createdAt" | "updatedAt" | "deletedAt">) => Effect.Effect<PersonId>
  delete: (id: PersonId) => Effect.Effect<PersonId, PersonErrorNotFound, never>
  readAll: (urlParams: URLParams<Person>) => Effect.Effect<SuccessArray<Person, never, never>>
  readById: (id: PersonId) => Effect.Effect<Person, PersonErrorNotFound, never>
  readByIds: (ids: Array<PersonId>) => Effect.Effect<Array<Person>, PersonErrorNotFound, never>
  update: (
    id: PersonId,
    person: Partial<Omit<Person, "id" | "createdAt" | "updatedAt" | "deletedAt">>
  ) => Effect.Effect<PersonId, PersonErrorNotFound, never>
}>() {}
