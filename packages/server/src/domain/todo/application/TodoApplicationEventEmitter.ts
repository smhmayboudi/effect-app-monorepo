import { Effect, Layer } from "effect"
import { TodoEventEmitter } from "../adapter/TodoAdapterEventEmitter.js"

export const TodoEventEmitterLive = Layer.effectDiscard(
  Effect.flatMap(
    TodoEventEmitter,
    (eventEmitter) =>
      Effect.all([
        eventEmitter.on("TodoUseCaseCreate", Effect.logDebug),
        eventEmitter.on("TodoUseCaseDelete", Effect.logDebug),
        eventEmitter.on("TodoUseCaseReadAll", Effect.logDebug),
        eventEmitter.on("TodoUseCaseReadById", Effect.logDebug),
        eventEmitter.on("TodoUseCaseUpdate", Effect.logInfo)
      ], { concurrency: "unbounded" })
  )
)
