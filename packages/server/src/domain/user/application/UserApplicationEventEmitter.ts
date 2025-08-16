import { Effect, Layer } from "effect"
import { UserEventEmitter } from "../adapter/UserAdapterEventEmitter.js"

export const UserEventEmitterLive = Layer.effectDiscard(
  Effect.flatMap(
    UserEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("UserUseCaseCreate", Effect.logDebug),
        eventEmitter.on("UserUseCaseDelete", Effect.logDebug),
        eventEmitter.on("UserUseCaseReadAll", Effect.logDebug),
        eventEmitter.on("UserUseCaseReadByAccessToken", Effect.logDebug),
        eventEmitter.on("UserUseCaseReadById", Effect.logDebug),
        eventEmitter.on("UserUseCaseReadByIdWithSensitive", Effect.logDebug),
        eventEmitter.on("UserUseCaseUpdate", Effect.logInfo)
      ], { concurrency: "unbounded" })
  )
)
