import { Effect, Layer } from "effect";
import { PortPersonDriving } from "./port-person-driving.js";
import { PortPersonDriven } from "./port-person-driven.js";
import { ErrorPersonNotFound } from "@template/domain/person/application/error-person-not-found"
import { DomainPerson, PersonId } from "@template/domain/person/application/domain-person"

export const PersonUseCase = Layer.effect(
  PortPersonDriving,
  Effect.gen(function* () {
    const driven = yield* PortPersonDriven

    const create = (person: Omit<DomainPerson, "id">): Effect.Effect<PersonId, never, never> => 
      driven.create(person)

    const del = (id: PersonId): Effect.Effect<PersonId, ErrorPersonNotFound, never> =>
      Effect.gen(function* () {
        yield* driven.delete(id)

        return id
      })

    const readAll = (): Effect.Effect<DomainPerson[], never, never> =>
      driven.readAll()

    const readById = (id: PersonId): Effect.Effect<DomainPerson, ErrorPersonNotFound, never> =>
      driven.readById(id)

    const update = (id: PersonId, person: Partial<Omit<DomainPerson, "id">>): Effect.Effect<PersonId, ErrorPersonNotFound, never> =>
      Effect.gen(function* () {
        yield* driven.update(id, person)

        return id
      })

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    } as const
  })
)
