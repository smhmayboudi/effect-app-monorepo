import { Effect, Layer } from "effect"
import { PortPersonDriving } from "./port-person-driving.js"
import { PortPersonDriven } from "./port-person-driven.js"
import { ErrorPersonNotFound } from "@template/domain/person/application/error-person-not-found"
import { DomainPerson, PersonId } from "@template/domain/person/application/domain-person"

export const PersonUseCase = Layer.effect(
  PortPersonDriving,
  Effect.gen(function* () {
    const driven = yield* PortPersonDriven

    const create = (person: Omit<DomainPerson, "id" | "createdAt" | "updatedAt">): Effect.Effect<PersonId, never, never> =>
      driven.create(person)
        .pipe(Effect.withSpan("person.use-case.create", { attributes: { person } }))

    const del = (id: PersonId): Effect.Effect<PersonId, ErrorPersonNotFound, never> =>
      driven.delete(id)
        .pipe(Effect.flatMap(() => Effect.succeed(id)))
        .pipe(Effect.withSpan("person.use-case.delete", { attributes: { id } }))

    const readAll = (): Effect.Effect<DomainPerson[], never, never> =>
      driven.readAll()
        .pipe(Effect.withSpan("person.use-case.readAll"))

    const readById = (id: PersonId): Effect.Effect<DomainPerson, ErrorPersonNotFound, never> =>
      driven.readById(id)
        .pipe(Effect.withSpan("person.use-case.readById", { attributes: { id } }))

    const update = (id: PersonId, person: Partial<Omit<DomainPerson, "id">>): Effect.Effect<PersonId, ErrorPersonNotFound, never> =>
      driven.update(id, person)
        .pipe(Effect.flatMap(() => Effect.succeed(id)))
        .pipe(Effect.withSpan("person.use-case.update", { attributes: { id, person } }))

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    } as const
  })
)
