import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { ActorAuthorized } from "@template/domain/actor"
import type { DomainPerson, PersonId } from "@template/domain/person/application/domain-person"
import type { ErrorPersonNotFound } from "@template/domain/person/application/error-person-not-found"
import { PortPersonDriven } from "@template/server/domain/person/application/port-person-driven"
import { PortPersonDriving } from "@template/server/domain/person/application/port-person-driving"
import { policyRequire } from "@template/server/util/policy"
import { Effect, Layer } from "effect"

export const PersonUseCase = Layer.effect(
  PortPersonDriving,
  Effect.gen(function*() {
    const driven = yield* PortPersonDriven

    const create = (
      person: Omit<DomainPerson, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<PersonId, never, ActorAuthorized<"Person", "create">> =>
      driven.create(person)
        .pipe(
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", person } }),
          policyRequire("Person", "create")
        )

    const del = (id: PersonId): Effect.Effect<PersonId, ErrorPersonNotFound, ActorAuthorized<"Person", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
          policyRequire("Person", "delete")
        )

    const readAll = (): Effect.Effect<Array<DomainPerson>, never, ActorAuthorized<"Person", "readAll">> =>
      driven.readAll()
        .pipe(
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } }),
          policyRequire("Person", "readAll")
        )

    const readById = (
      id: PersonId
    ): Effect.Effect<DomainPerson, ErrorPersonNotFound, ActorAuthorized<"Person", "readById">> =>
      driven.readById(id)
        .pipe(
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
          policyRequire("Person", "readById")
        )

    const update = (
      id: PersonId,
      person: Partial<Omit<DomainPerson, "id">>
    ): Effect.Effect<PersonId, ErrorPersonNotFound, ActorAuthorized<"Person", "update">> =>
      driven.update(id, person)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, person } }),
          policyRequire("Person", "update")
        )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
