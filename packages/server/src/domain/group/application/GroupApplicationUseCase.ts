import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { ActorAuthorized } from "@template/domain/Actor"
import type { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import type { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import { Effect, Exit, Layer } from "effect"
import { policyRequire } from "../../../util/Policy.js"
import { GroupReadById, makeGroupReadResolver } from "./GroupApplicationCache.js"
import { GroupPortDriven } from "./GroupApplicationPortDriven.js"
import { GroupPortDriving } from "./GroupApplicationPortDriving.js"
import { GroupPortEventEmitter } from "./GroupApplicationPortEventEmitter.js"

export const GroupUseCase = Layer.scoped(
  GroupPortDriving,
  Effect.gen(function*() {
    const eventEmitter = yield* GroupPortEventEmitter
    const driven = yield* GroupPortDriven
    const resolver = yield* makeGroupReadResolver

    const create = (
      group: Omit<Group, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<GroupId, never, ActorAuthorized<"Group", "create">> =>
      driven.create(group)
        .pipe(
          Effect.tapBoth({
            onFailure: (out) =>
              eventEmitter.emit("GroupUseCaseCreate", {
                in: { group },
                out: Exit.fail(out)
              }),
            onSuccess: (out) =>
              eventEmitter.emit("GroupUseCaseCreate", {
                in: { group },
                out: Exit.succeed(out)
              })
          }),
          Effect.withSpan("GroupUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", group } }),
          policyRequire("Group", "create")
        )

    const del = (id: GroupId): Effect.Effect<GroupId, GroupErrorNotFound, ActorAuthorized<"Group", "delete">> =>
      driven.delete(id)
        .pipe(
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
        )

    const readAll = (
      urlParams: URLParams<Group>
    ): Effect.Effect<SuccessArray<Group, never, never>, never, ActorAuthorized<"Group", "readAll">> =>
      driven.readAll(urlParams)
        .pipe(
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
        )

    const readById = (
      id: GroupId
    ): Effect.Effect<Group, GroupErrorNotFound, ActorAuthorized<"Group", "readById">> =>
      Effect.request(new GroupReadById({ id }), resolver)
        .pipe(
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
        )

    const update = (
      id: GroupId,
      group: Partial<Omit<Group, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<GroupId, GroupErrorNotFound, ActorAuthorized<"Group", "update">> =>
      driven.update(id, group)
        .pipe(
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

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
