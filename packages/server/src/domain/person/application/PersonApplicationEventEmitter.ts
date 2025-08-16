import { Effect, Layer } from "effect"
import { PersonEventEmitter } from "../adapter/PersonAdapterEventEmitter.js"

export const PersonEventEmitterLive = Layer.effectDiscard(
  Effect.flatMap(
    PersonEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("PersonUseCaseCreate", Effect.logDebug),
        eventEmitter.on("PersonUseCaseDelete", Effect.logDebug),
        eventEmitter.on("PersonUseCaseReadAll", Effect.logDebug),
        eventEmitter.on("PersonUseCaseReadById", Effect.logDebug),
        eventEmitter.on("PersonUseCaseUpdate", Effect.logInfo)
      ], { concurrency: "unbounded" })
  )
)
