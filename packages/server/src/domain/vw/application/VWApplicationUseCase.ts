import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as Layer from "effect/Layer"
import { policyRequire } from "../../../util/Policy.js"
import { VWPortDriven } from "./VWApplicationPortDriven.js"
import { VWPortDriving } from "./VWApplicationPortDriving.js"
import { VWPortEventEmitter } from "./VWApplicationPortEventEmitter.js"

export const VWUseCase = Layer.effect(
  VWPortDriving,
  Effect.all([VWPortDriven, VWPortEventEmitter]).pipe(
    Effect.andThen(([driven, eventEmitter]) =>
      VWPortDriving.of({
        readAllGroupPersonTodo: (urlParams) =>
          driven.readAllGroupPersonTodo(urlParams).pipe(
            Effect.tapBoth({
              onFailure: (out) =>
                eventEmitter.emit("VWUseCaseReadAllGroupPersonTodo", {
                  in: { urlParams },
                  out: Exit.fail(out)
                }),
              onSuccess: (out) =>
                eventEmitter.emit("VWUseCaseReadAllGroupPersonTodo", {
                  in: { urlParams },
                  out: Exit.succeed(out)
                })
            }),
            Effect.withSpan("VWUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll", urlParams } }),
            policyRequire("VW", "readAllGroupPersonTodo")
          )
      })
    )
  )
)
