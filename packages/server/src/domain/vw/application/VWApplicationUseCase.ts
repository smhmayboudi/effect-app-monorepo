import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { ActorAuthorized } from "@template/domain/Actor"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { UserGroupPerson } from "@template/domain/vw/application/UserGroupPersonApplicationDomain"
import type { UserTodo } from "@template/domain/vw/application/UserTodoApplicationDomain"
import { Effect, Exit, Layer } from "effect"
import { policyRequire } from "../../../util/Policy.js"
import { VWPortDriven } from "./VWApplicationPortDriven.js"
import { VWPortDriving } from "./VWApplicationPortDriving.js"
import { VWPortEventEmitter } from "./VWApplicationPortEventEmitter.js"

export const VWUseCase = Layer.scoped(
  VWPortDriving,
  Effect.gen(function*() {
    const eventEmitter = yield* VWPortEventEmitter
    const driven = yield* VWPortDriven

    const readAllUserGroupPerson = (
      urlParams: URLParams<UserGroupPerson>
    ): Effect.Effect<
      SuccessArray<UserGroupPerson, never, never>,
      never,
      ActorAuthorized<"VW", "readAllUserGroupPerson">
    > =>
      driven.readAllUserGroupPerson(urlParams).pipe(
        Effect.tapBoth({
          onFailure: (out) =>
            eventEmitter.emit("VWUseCaseReadAllUserGroupPerson", {
              in: { urlParams },
              out: Exit.fail(out)
            }),
          onSuccess: (out) =>
            eventEmitter.emit("VWUseCaseReadAllUserGroupPerson", {
              in: { urlParams },
              out: Exit.succeed(out)
            })
        }),
        Effect.withSpan("VWUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
        policyRequire("VW", "readAllUserGroupPerson")
      )

    const readAllUserTodo = (
      urlParams: URLParams<UserTodo>
    ): Effect.Effect<SuccessArray<UserTodo, never, never>, never, ActorAuthorized<"VW", "readAllUserTodo">> =>
      driven.readAllUserTodo(urlParams).pipe(
        Effect.tapBoth({
          onFailure: (out) =>
            eventEmitter.emit("VWUseCaseReadAllUserTodo", {
              in: { urlParams },
              out: Exit.fail(out)
            }),
          onSuccess: (out) =>
            eventEmitter.emit("VWUseCaseReadAllUserTodo", {
              in: { urlParams },
              out: Exit.succeed(out)
            })
        }),
        Effect.withSpan("VWUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
        policyRequire("VW", "readAllUserTodo")
      )

    return {
      readAllUserGroupPerson,
      readAllUserTodo
    } as const
  })
)
