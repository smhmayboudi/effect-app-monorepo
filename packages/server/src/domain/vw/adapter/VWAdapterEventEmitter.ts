import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Effect, Layer } from "effect"
import { VWPortEventEmitter } from "../application/VWApplicationPortEventEmitter.js"

export const VWEventEmitter = Layer.effectDiscard(
  Effect.flatMap(
    VWPortEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("VWUseCaseReadAllUserGroupPerson", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "VWUseCaseReadAllUserGroupPerson", ...data })),
        eventEmitter.on("VWUseCaseReadAllUserTodo", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "VWUseCaseReadAllUserTodo", ...data }))
      ], { concurrency: "unbounded" })
  )
)
