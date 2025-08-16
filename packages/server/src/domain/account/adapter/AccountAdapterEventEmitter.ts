import { Effect, Layer } from "effect"
import { AccountPortEventEmitter } from "../application/AccountApplicationPortEventEmitter.js"

export const AccountEventEmitter = Layer.effectDiscard(
  Effect.flatMap(
    AccountPortEventEmitter,
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
