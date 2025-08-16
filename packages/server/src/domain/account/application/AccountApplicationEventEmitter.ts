import { Effect, Layer } from "effect"
import { AccountEventEmitter } from "../adapter/AccountAdapterEventEmitter.js"

export const AccountEventEmitterLive = Layer.effectDiscard(
  Effect.flatMap(
    AccountEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("AccountUseCaseCreate", Effect.logDebug),
        eventEmitter.on("AccountUseCaseDelete", Effect.logDebug),
        eventEmitter.on("AccountUseCaseReadAll", Effect.logDebug),
        eventEmitter.on("AccountUseCaseReadById", Effect.logDebug),
        eventEmitter.on("AccountUseCaseUpdate", Effect.logInfo)
      ], { concurrency: "unbounded" })
  )
)
