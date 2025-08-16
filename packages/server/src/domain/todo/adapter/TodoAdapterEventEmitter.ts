import { Effect, Layer } from "effect"
import { TodoPortEventEmitter } from "../application/TodoApplicationPortEventEmitter.js"

export const TodoEventEmitter = Layer.effectDiscard(
  Effect.flatMap(
    TodoPortEventEmitter,
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
