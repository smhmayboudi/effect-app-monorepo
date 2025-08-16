import { Effect, Layer } from "effect"
import { GroupPortEventEmitter } from "../application/GroupApplicationPortEventEmitter.js"

export const GroupEventEmitter = Layer.effectDiscard(
  Effect.flatMap(
    GroupPortEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("GroupUseCaseCreate", Effect.logDebug),
        eventEmitter.on("GroupUseCaseDelete", Effect.logDebug),
        eventEmitter.on("GroupUseCaseReadAll", Effect.logDebug),
        eventEmitter.on("GroupUseCaseReadById", Effect.logDebug),
        eventEmitter.on("GroupUseCaseUpdate", Effect.logInfo)
      ], { concurrency: "unbounded" })
  )
)
