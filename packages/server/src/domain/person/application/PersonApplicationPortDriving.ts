import type { ActorAuthorized } from "@template/domain/Actor"
import type { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import type { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import type { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Context, type Effect } from "effect"

export class PersonPortDriving extends Context.Tag("PersonPortDriving")<PersonPortDriving, {
  create: (
    person: Omit<Person, "id" | "createdAt" | "updatedAt">
  ) => Effect.Effect<
    PersonId,
    GroupErrorNotFound,
    ActorAuthorized<"Person", "create"> | ActorAuthorized<"Group", "readById">
  >
  delete: (id: PersonId) => Effect.Effect<PersonId, PersonErrorNotFound, ActorAuthorized<"Person", "delete">>
  readAll: (
    urlParams: URLParams<Person>
  ) => Effect.Effect<SuccessArray<Person, never, never>, never, ActorAuthorized<"Person", "readAll">>
  readById: (id: PersonId) => Effect.Effect<Person, PersonErrorNotFound, ActorAuthorized<"Person", "readById">>
  update: (
    id: PersonId,
    person: Partial<Omit<Person, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<PersonId, PersonErrorNotFound, ActorAuthorized<"Person", "update">>
}>() {}
