import { Effect, Layer } from "effect";
import { PortPersonDriven } from "../application/port-person-driven.js";
import { ErrorPersonNotFound } from "@template/domain/person/application/error-person-not-found"
import { DomainPerson, PersonId } from "@template/domain/person/application/domain-person"
import { GroupId } from "@template/domain/group/application/domain-group";

export const PersonDriven = Layer.effect(
  PortPersonDriven,
  Effect.gen(function* () {
    const create = (person: Omit<DomainPerson, "id">): Effect.Effect<PersonId, never, never> =>
      Effect.succeed(PersonId.make(0))

    const del = (id: PersonId): Effect.Effect<void, ErrorPersonNotFound, never> =>
      Effect.void

    const readAll = (): Effect.Effect<DomainPerson[], never, never> =>
      Effect.succeed([DomainPerson.make({
        id: PersonId.make(0),
        groupId: GroupId.make(0),
        birthday: new Date(),
        firstName: "",
        lastName: "",
        createdAt: new Date(),
        updatedAt: new Date()
      })])

    const readById = (id: PersonId): Effect.Effect<DomainPerson, ErrorPersonNotFound, never> =>
      Effect.succeed(DomainPerson.make({
        id: PersonId.make(0),
        groupId: GroupId.make(0),
        birthday: new Date(),
        firstName: "",
        lastName: "",
        createdAt: new Date(),
        updatedAt: new Date()
      }))

    const update = (id: PersonId, person: Partial<Omit<DomainPerson, "id">>): Effect.Effect<void, ErrorPersonNotFound, never> =>
      Effect.succeed(PersonId.make(0))

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
