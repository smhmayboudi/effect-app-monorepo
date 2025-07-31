import { Effect, Layer } from "effect"
import { PortPersonDriving } from "./port-person-driving.js"
import { PortPersonDriven } from "./port-person-driven.js"
import { ErrorPersonNotFound } from "@template/domain/person/application/error-person-not-found"
import { DomainPerson, PersonId } from "@template/domain/person/application/domain-person"
import { policyRequire } from "../../../util/policy.js"
import { ActorAuthorized } from "@template/domain/actor"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"

export const PersonUseCase = Layer.effect(
  PortPersonDriving,
  Effect.gen(function* () {
    const driven = yield* PortPersonDriven

    const create = (person: Omit<DomainPerson, "id" | "createdAt" | "updatedAt">): Effect.Effect<PersonId, never, ActorAuthorized<"Person", "create">> =>
      driven.create(person)
        .pipe(
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", person }}),
          policyRequire("Person", "create")
        )

    const del = (id: PersonId): Effect.Effect<PersonId, ErrorPersonNotFound, ActorAuthorized<"Person", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id }}),
          policyRequire("Person", "delete")
        )

    const readAll = (): Effect.Effect<DomainPerson[], never, ActorAuthorized<"Person", "readAll">> =>
      driven.readAll()
        .pipe(
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" }}),
          policyRequire("Person", "readAll")
        )

    const readById = (id: PersonId): Effect.Effect<DomainPerson, ErrorPersonNotFound, ActorAuthorized<"Person", "readById">> =>
      driven.readById(id)
        .pipe(
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id }}),
          policyRequire("Person", "readById")
        )

    const update = (id: PersonId, person: Partial<Omit<DomainPerson, "id">>): Effect.Effect<PersonId, ErrorPersonNotFound, ActorAuthorized<"Person", "update">> =>
      driven.update(id, person)
        .pipe(
          Effect.flatMap(() => Effect.succeed(id)),
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, person }}),
          policyRequire("Person", "update")
        )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update,
    } as const
  })
)
