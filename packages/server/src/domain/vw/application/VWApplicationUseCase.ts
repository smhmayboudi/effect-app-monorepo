import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Effect, Exit, Layer } from "effect"
import { policyRequire } from "../../../util/Policy.js"
import { VWPortDriven } from "./VWApplicationPortDriven.js"
import { VWPortDriving } from "./VWApplicationPortDriving.js"
import { VWPortEventEmitter } from "./VWApplicationPortEventEmitter.js"

export const VWUseCase = Layer.scoped(
  VWPortDriving,
  Effect.all([VWPortDriven, VWPortEventEmitter]).pipe(
    Effect.flatMap(([driven, eventEmitter]) =>
      Effect.sync(() =>
        VWPortDriving.of({
          readAllUserGroupPerson: (urlParams) =>
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
            ),
          readAllUserTodo: (urlParams) =>
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
        })
      )
    )
  )
)
