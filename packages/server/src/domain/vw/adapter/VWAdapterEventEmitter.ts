import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { VWPortEventEmitter } from "../application/VWApplicationPortEventEmitter.js"

export const VWEventEmitter = Layer.effectDiscard(
  VWPortEventEmitter.pipe(
    Effect.flatMap(
      (eventEmitter) =>
        Effect.all([
          eventEmitter.on("VWUseCaseReadAllGroupPersonTodo", (data) =>
            Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "VWUseCaseReadAllGroupPersonTodo", ...data }))
        ], { concurrency: "unbounded" })
    )
  )
)
