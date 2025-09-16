import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Effect, Layer } from "effect"
import { ServicePortEventEmitter } from "../application/ServiceApplicationPortEventEmitter.js"

export const ServiceEventEmitter = Layer.effectDiscard(
  Effect.flatMap(
    ServicePortEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("ServiceUseCaseCreate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "ServiceUseCaseCreate", ...data })),
        eventEmitter.on("ServiceUseCaseDelete", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "ServiceUseCaseDelete", ...data })),
        eventEmitter.on("ServiceUseCaseReadAll", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "ServiceUseCaseReadAll", ...data })),
        eventEmitter.on("ServiceUseCaseReadById", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "ServiceUseCaseReadById", ...data })),
        eventEmitter.on("ServiceUseCaseUpdate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "ServiceUseCaseUpdate", ...data }))
      ], { concurrency: "unbounded" })
  )
)
