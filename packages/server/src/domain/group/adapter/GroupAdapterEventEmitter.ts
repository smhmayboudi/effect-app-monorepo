import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { GroupPortEventEmitter } from "../application/GroupApplicationPortEventEmitter.js"

export const GroupEventEmitter = Layer.effectDiscard(
  Effect.flatMap(
    GroupPortEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("GroupUseCaseCreate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "GroupUseCaseCreate", ...data })),
        eventEmitter.on("GroupUseCaseDelete", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "GroupUseCaseDelete", ...data })),
        eventEmitter.on("GroupUseCaseReadAll", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "GroupUseCaseReadAll", ...data })),
        eventEmitter.on("GroupUseCaseReadById", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "GroupUseCaseReadById", ...data })),
        eventEmitter.on("GroupUseCaseUpdate", (data) =>
          Effect.logDebug({ [ATTR_CODE_FUNCTION_NAME]: "GroupUseCaseUpdate", ...data }))
      ], { concurrency: "unbounded" })
  )
)
