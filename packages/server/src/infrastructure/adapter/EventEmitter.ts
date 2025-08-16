import { Chunk, Effect, HashMap, Queue, Ref } from "effect"
import type { EventEmitter } from "../application/PortEventEmitter.js"

export const make = <Events extends Record<string, any>>(): Effect.Effect<EventEmitter<Events>> =>
  Effect.gen(function*() {
    const listeners = yield* Ref.make(HashMap.empty<keyof Events, Queue.Queue<(data: any) => Effect.Effect<any>>>())

    const getListeners = <K extends keyof Events>(
      event: K
    ): Effect.Effect<Queue.Queue<(data: any) => Effect.Effect<any>>> =>
      Ref.get(listeners).pipe(
        Effect.flatMap((map) => {
          const existing = HashMap.get(map, event)
          if (existing._tag === "Some") {
            return Effect.succeed(existing.value)
          }
          return Queue.unbounded<(data: any) => Effect.Effect<any>>().pipe(
            Effect.tap((newQueue) => Ref.update(listeners, (map) => HashMap.set(map, event, newQueue)))
          )
        })
      )

    const emit: EventEmitter<Events>["emit"] = (event, data) =>
      getListeners(event).pipe(
        Effect.flatMap((queue) => Queue.takeAll(queue)),
        Effect.flatMap((currentListeners) =>
          Effect.forEach(currentListeners, (listener) => Effect.forkDaemon(listener(data)))
        ),
        Effect.asVoid
      )

    const off: EventEmitter<Events>["off"] = (event) =>
      Ref.update(listeners, (map) => HashMap.remove(map, event)).pipe(Effect.asVoid)

    const on: EventEmitter<Events>["on"] = (event, callback) =>
      getListeners(event).pipe(
        Effect.flatMap((queue) => Queue.offer(queue, callback)),
        Effect.asVoid
      )

    const once: EventEmitter<Events>["once"] = (event, callback) =>
      getListeners(event).pipe(
        Effect.flatMap((queue) => {
          const wrappedCallback = (data: any) =>
            callback(data).pipe(
              Effect.flatMap(() =>
                Queue.takeAll(queue).pipe(
                  Effect.flatMap((listenersChunk) =>
                    Queue.offerAll(queue, Chunk.toArray(listenersChunk).filter((l) => l !== wrappedCallback))
                  )
                )
              )
            )
          return Queue.offer(queue, wrappedCallback)
        }),
        Effect.asVoid
      )

    return { emit, off, on, once } as const
  })
