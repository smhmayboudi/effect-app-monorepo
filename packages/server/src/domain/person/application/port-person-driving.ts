import type { ActorAuthorized } from "@template/domain/Actor"
import type { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import type { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import type { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import { Context, type Effect } from "effect"

export class PortPersonDriving extends Context.Tag("PortPersonDriving")<PortPersonDriving, {
  create: (
    person: Omit<Person, "id" | "createdAt" | "updatedAt">
  ) => Effect.Effect<
    PersonId,
    GroupErrorNotFound,
    ActorAuthorized<"Person", "create"> | ActorAuthorized<"Group", "readById">
  >
  delete: (id: PersonId) => Effect.Effect<PersonId, PersonErrorNotFound, ActorAuthorized<"Person", "delete">>
  readAll: () => Effect.Effect<Array<Person>, never, ActorAuthorized<"Person", "readAll">>
  readById: (id: PersonId) => Effect.Effect<Person, PersonErrorNotFound, ActorAuthorized<"Person", "readById">>
  update: (
    id: PersonId,
    person: Partial<Omit<Person, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<PersonId, PersonErrorNotFound, ActorAuthorized<"Person", "update">>
}>() {}
