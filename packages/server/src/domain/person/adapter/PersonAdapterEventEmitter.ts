import { Effect, Layer } from "effect"
import { PersonPortEventEmitter } from "../application/PersonApplicationPortEventEmitter.js"

export const PersonEventEmitter = Layer.effectDiscard(
  Effect.flatMap(
    PersonPortEventEmitter,
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
