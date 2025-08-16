import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Effect, Layer } from "effect"
import { UserPortEventEmitter } from "../application/UserApplicationPortEventEmitter.js"

export const UserEventEmitter = Layer.effectDiscard(
  Effect.flatMap(
    UserPortEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("UserUseCaseCreate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "UserUseCaseCreate", ...data })),
        eventEmitter.on("UserUseCaseDelete", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "UserUseCaseDelete", ...data })),
        eventEmitter.on("UserUseCaseReadAll", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "UserUseCaseReadAll", ...data })),
        eventEmitter.on("UserUseCaseReadByAccessToken", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "UserUseCaseReadByAccessToken", ...data })),
        eventEmitter.on("UserUseCaseReadById", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "UserUseCaseReadById", ...data })),
        eventEmitter.on("UserUseCaseReadByIdWithSensitive", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "UserUseCaseReadByIdWithSensitive", ...data })),
        eventEmitter.on("UserUseCaseUpdate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "UserUseCaseUpdate", ...data }))
      ], { concurrency: "unbounded" })
  )
)
