import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Layer from "effect/Layer"
import { PortUUID } from "../../../infrastructure/application/PortUUID.js"
import { policyRequire } from "../../../util/Policy.js"
import { GroupPortDriving } from "../../group/application/GroupApplicationPortDriving.js"
import { makePersonReadResolver, PersonReadById } from "./PersonApplicationCache.js"
import { PersonPortDriven } from "./PersonApplicationPortDriven.js"
import { PersonPortDriving } from "./PersonApplicationPortDriving.js"
import { PersonPortEventEmitter } from "./PersonApplicationPortEventEmitter.js"

export const PersonUseCase = Layer.scoped(
  PersonPortDriving,
  Effect.all([PortUUID, PersonPortDriven, PersonPortEventEmitter, makePersonReadResolver, GroupPortDriving]).pipe(
    Effect.flatMap(([uuid, driven, eventEmitter, resolver, group]) =>
      Effect.sync(() =>
        PersonPortDriving.of({
          create: (person) =>
            group.readById(person.groupId).pipe(
              Effect.zipRight(
                uuid.v7().pipe(
                  Effect.flatMap((v7) =>
                    driven.create({ ...person, id: PersonId.make(v7) }).pipe(
                      Effect.tapBoth({
                        onFailure: (out) =>
                          eventEmitter.emit("PersonUseCaseCreate", {
                            in: { person: { ...person, id: PersonId.make(v7) } },
                            out: Exit.fail(out)
                          }),
                        onSuccess: (out) =>
                          eventEmitter.emit("PersonUseCaseCreate", {
                            in: { person: { ...person, id: PersonId.make(v7) } },
                            out: Exit.succeed(out)
                          })
                      }),
                      Effect.withSpan("PersonUseCase", {
                        attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", person }
                      }),
                      policyRequire("Person", "create")
                    )
                  )
                )
              )
            ),
          delete: (id) =>
            driven.delete(id).pipe(
              Effect.tapBoth({
                onFailure: (out) =>
                  eventEmitter.emit("PersonUseCaseDelete", {
                    in: { id },
                    out: Exit.fail(out)
                  }),
                onSuccess: (out) =>
                  eventEmitter.emit("PersonUseCaseDelete", {
                    in: { id },
                    out: Exit.succeed(out)
                  })
              }),
              Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
              policyRequire("Person", "delete")
            ),
          readAll: (urlParams) =>
            driven.readAll(urlParams).pipe(
              Effect.tapBoth({
                onFailure: (out) =>
                  eventEmitter.emit("PersonUseCaseReadAll", {
                    in: { urlParams },
                    out: Exit.succeed(out)
                  }),
                onSuccess: (out) =>
                  eventEmitter.emit("PersonUseCaseReadAll", {
                    in: { urlParams },
                    out: Exit.succeed(out)
                  })
              }),
              Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
              policyRequire("Person", "readAll")
            ),
          readById: (id) =>
            Effect.request(new PersonReadById({ id }), resolver).pipe(
              Effect.tapBoth({
                onFailure: (out) =>
                  eventEmitter.emit("PersonUseCaseReadById", {
                    in: { id },
                    out: Exit.fail(out)
                  }),
                onSuccess: (out) =>
                  eventEmitter.emit("PersonUseCaseReadById", {
                    in: { id },
                    out: Exit.succeed(out)
                  })
              }),
              Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
              policyRequire("Person", "readById")
            ),
          update: (id, person) =>
            driven.update(id, person).pipe(
              Effect.tapBoth({
                onFailure: (out) =>
                  eventEmitter.emit("PersonUseCaseUpdate", {
                    in: { id, person },
                    out: Exit.fail(out)
                  }),
                onSuccess: (out) =>
                  eventEmitter.emit("PersonUseCaseUpdate", {
                    in: { id, person },
                    out: Exit.succeed(out)
                  })
              }),
              Effect.withSpan("PersonUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, person } }),
              policyRequire("Person", "update")
            )
        })
      )
    )
  )
)
