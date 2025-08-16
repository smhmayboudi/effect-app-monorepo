import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { ActorAuthorized } from "@template/domain/Actor"
import type { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import type { Person, PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import type { PersonErrorNotFound } from "@template/domain/person/application/PersonApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Effect, Exit, Layer } from "effect"
import { policyRequire } from "../../../util/Policy.js"
import { GroupPortDriving } from "../../group/application/GroupApplicationPortDriving.js"
import { PersonEventEmitter } from "../adapter/PersonAdapterEventEmitter.js"
import { makePersonReadResolver, PersonReadById } from "./PersonApplicationCache.js"
import { PersonPortDriven } from "./PersonApplicationPortDriven.js"
import { PersonPortDriving } from "./PersonApplicationPortDriving.js"

export const PersonUseCase = Layer.effect(
  PersonPortDriving,
  Effect.gen(function*() {
    const eventEmitter = yield* PersonEventEmitter
    const driven = yield* PersonPortDriven
    const group = yield* GroupPortDriving
    const resolver = yield* makePersonReadResolver

    const create = (
      person: Omit<Person, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<
      PersonId,
      GroupErrorNotFound,
      ActorAuthorized<"Person", "create"> | ActorAuthorized<"Group", "readById">
    > =>
      group.readById(person.groupId).pipe(
        Effect.zipRight(
          driven.create(person)
            .pipe(
              Effect.tap((out) =>
                eventEmitter.emit("PersonUseCaseCreate", {
                  in: { person },
                  out: Exit.succeed(out)
                })
              ),
              Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", person } }),
              policyRequire("Person", "create")
            )
        )
      )

    const del = (id: PersonId): Effect.Effect<PersonId, PersonErrorNotFound, ActorAuthorized<"Person", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.tap((out) =>
            eventEmitter.emit("PersonUseCaseDelete", {
              in: { id },
              out: Exit.succeed(out)
            })
          ),
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
          policyRequire("Person", "delete")
        )

    const readAll = (
      urlParams: URLParams<Person>
    ): Effect.Effect<SuccessArray<Person, never, never>, never, ActorAuthorized<"Person", "readAll">> =>
      driven.readAll(urlParams)
        .pipe(
          Effect.tap((out) =>
            eventEmitter.emit("PersonUseCaseReadAll", {
              in: { urlParams },
              out: Exit.succeed(out)
            })
          ),
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
          policyRequire("Person", "readAll")
        )

    const readById = (
      id: PersonId
    ): Effect.Effect<Person, PersonErrorNotFound, ActorAuthorized<"Person", "readById">> =>
      Effect.request(new PersonReadById({ id }), resolver)
        .pipe(
          Effect.tap((out) =>
            eventEmitter.emit("PersonUseCaseReadById", {
              in: { id },
              out: Exit.succeed(out)
            })
          ),
          Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
          policyRequire("Person", "readById")
        )

    const update = (
      id: PersonId,
      person: Partial<Omit<Person, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<PersonId, PersonErrorNotFound, ActorAuthorized<"Person", "update">> =>
      driven.update(id, person)
        .pipe(
          Effect.tap((out) =>
            eventEmitter.emit("PersonUseCaseUpdate", {
              in: { id, person },
              out: Exit.succeed(out)
            })
          ),
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
