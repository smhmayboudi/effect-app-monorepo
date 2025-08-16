import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Effect, Layer } from "effect"
import { TodoPortEventEmitter } from "../application/TodoApplicationPortEventEmitter.js"

export const TodoEventEmitter = Layer.effectDiscard(
  Effect.flatMap(
    TodoPortEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("TodoUseCaseCreate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "TodoUseCaseCreate", ...data })),
        eventEmitter.on("TodoUseCaseDelete", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "TodoUseCaseDelete", ...data })),
        eventEmitter.on("TodoUseCaseReadAll", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "TodoUseCaseReadAll", ...data })),
        eventEmitter.on("TodoUseCaseReadById", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "TodoUseCaseReadById", ...data })),
        eventEmitter.on("TodoUseCaseUpdate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "TodoUseCaseUpdate", ...data }))
      ], { concurrency: "unbounded" })
  )
)
