import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { Effect, Exit, Layer } from "effect"
import { PortUUID } from "../../../infrastructure/application/PortUUID.js"
import { policyRequire } from "../../../util/Policy.js"
import { GroupReadById, makeGroupReadResolver } from "./GroupApplicationCache.js"
import { GroupPortDriven } from "./GroupApplicationPortDriven.js"
import { GroupPortDriving } from "./GroupApplicationPortDriving.js"
import { GroupPortEventEmitter } from "./GroupApplicationPortEventEmitter.js"

export const GroupUseCase = Layer.scoped(
  GroupPortDriving,
  Effect.gen(function*() {
    const uuid = yield* PortUUID
    const driven = yield* GroupPortDriven
    const eventEmitter = yield* GroupPortEventEmitter
    const resolver = yield* makeGroupReadResolver

    return GroupPortDriving.of({
      create: (group) =>
        uuid.v7().pipe(
          Effect.flatMap((v7) =>
            driven.create({ ...group, id: GroupId.make(v7) }).pipe(
              Effect.tapBoth({
                onFailure: (out) =>
                  eventEmitter.emit("GroupUseCaseCreate", {
                    in: { group: { ...group, id: GroupId.make(v7) } },
                    out: Exit.fail(out)
                  }),
                onSuccess: (out) =>
                  eventEmitter.emit("GroupUseCaseCreate", {
                    in: { group: { ...group, id: GroupId.make(v7) } },
                    out: Exit.succeed(out)
                  })
              }),
              Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", group } }),
              policyRequire("Group", "create")
            )
          )
        ),
      delete: (id) =>
        driven.delete(id).pipe(
          Effect.tapBoth({
            onFailure: (out) =>
              eventEmitter.emit("GroupUseCaseDelete", {
                in: { id },
                out: Exit.fail(out)
              }),
            onSuccess: (out) =>
              eventEmitter.emit("GroupUseCaseDelete", {
                in: { id },
                out: Exit.succeed(out)
              })
          }),
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
          policyRequire("Group", "delete")
        ),
      readAll: (urlParams) =>
        driven.readAll(urlParams).pipe(
          Effect.tapBoth({
            onFailure: (out) =>
              eventEmitter.emit("GroupUseCaseReadAll", {
                in: { urlParams },
                out: Exit.fail(out)
              }),
            onSuccess: (out) =>
              eventEmitter.emit("GroupUseCaseReadAll", {
                in: { urlParams },
                out: Exit.succeed(out)
              })
          }),
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
          policyRequire("Group", "readAll")
        ),
      readById: (id) =>
        Effect.request(new GroupReadById({ id }), resolver).pipe(
          Effect.tapBoth({
            onFailure: (out) =>
              eventEmitter.emit("GroupUseCaseReadById", {
                in: { id },
                out: Exit.fail(out)
              }),
            onSuccess: (out) =>
              eventEmitter.emit("GroupUseCaseReadById", {
                in: { id },
                out: Exit.succeed(out)
              })
          }),
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
          policyRequire("Group", "readById")
        ),
      update: (id, group) =>
        driven.update(id, group).pipe(
          Effect.tapBoth({
            onFailure: (out) =>
              eventEmitter.emit("GroupUseCaseUpdate", {
                in: { id, group },
                out: Exit.fail(out)
              }),
            onSuccess: (out) =>
              eventEmitter.emit("GroupUseCaseUpdate", {
                in: { id, group },
                out: Exit.succeed(out)
              })
          }),
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, group } }),
          policyRequire("Group", "update")
        )
    })
  })
)
