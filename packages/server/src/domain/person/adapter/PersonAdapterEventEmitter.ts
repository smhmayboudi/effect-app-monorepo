import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Effect, Layer } from "effect"
import { PersonPortEventEmitter } from "../application/PersonApplicationPortEventEmitter.js"

export const PersonEventEmitter = Layer.effectDiscard(
  Effect.flatMap(
    PersonPortEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("PersonUseCaseCreate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "PersonUseCaseCreate", ...data })),
        eventEmitter.on("PersonUseCaseDelete", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "PersonUseCaseDelete", ...data })),
        eventEmitter.on("PersonUseCaseReadAll", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "PersonUseCaseReadAll", ...data })),
        eventEmitter.on("PersonUseCaseReadById", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "PersonUseCaseReadById", ...data })),
        eventEmitter.on("PersonUseCaseUpdate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "PersonUseCaseUpdate", ...data }))
      ], { concurrency: "unbounded" })
  )
)
