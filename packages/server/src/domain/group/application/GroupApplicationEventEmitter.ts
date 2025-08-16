import { Effect, Layer } from "effect"
import { GroupEventEmitter } from "../adapter/GroupAdapterEventEmitter.js"

export const GroupEventEmitterLive = Layer.effectDiscard(
  Effect.flatMap(
    GroupEventEmitter,
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
