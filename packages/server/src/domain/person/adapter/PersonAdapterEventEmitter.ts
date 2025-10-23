import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
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
