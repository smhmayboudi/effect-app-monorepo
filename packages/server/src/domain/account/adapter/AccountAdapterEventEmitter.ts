import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Effect, Layer } from "effect"
import { AccountPortEventEmitter } from "../application/AccountApplicationPortEventEmitter.js"

export const AccountEventEmitter = Layer.effectDiscard(
  Effect.flatMap(
    AccountPortEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("AccountUseCaseCreate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "AccountUseCaseCreate", ...data })),
        eventEmitter.on("AccountUseCaseDelete", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "AccountUseCaseDelete", ...data })),
        eventEmitter.on("AccountUseCaseReadAll", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "AccountUseCaseReadAll", ...data })),
        eventEmitter.on("AccountUseCaseReadById", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "AccountUseCaseReadById", ...data })),
        eventEmitter.on("AccountUseCaseUpdate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "AccountUseCaseUpdate", ...data }))
      ], { concurrency: "unbounded" })
  )
)
