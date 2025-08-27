import { Chunk, Effect, HashMap, Layer, Queue, Ref } from "effect"
import { PortEventEmitter } from "../application/PortEventEmitter.js"

export const EventEmitter = <Events extends Record<string, unknown>>() =>
  Layer.scoped(
    PortEventEmitter<Events>(),
    Effect.gen(function*() {
      const listeners = yield* Ref.make(HashMap.empty<keyof Events, Queue.Queue<(data: any) => Effect.Effect<void>>>())

      const getListeners = <K extends keyof Events>(
        event: K
      ): Effect.Effect<Queue.Queue<(data: any) => Effect.Effect<void>>> =>
        Ref.get(listeners).pipe(
          Effect.flatMap((map) => {
            const existing = HashMap.get(map, event)
            if (existing._tag === "Some") {
              return Effect.succeed(existing.value)
            }
            return Queue.unbounded<(data: any) => Effect.Effect<void>>().pipe(
              Effect.tap((newQueue) => Ref.update(listeners, (map) => HashMap.set(map, event, newQueue)))
            )
          })
        )

      return PortEventEmitter<Events>().of({
        emit: (event, data) =>
          getListeners(event).pipe(
            Effect.flatMap((queue) => Queue.takeAll(queue)),
            Effect.flatMap((currentListeners) =>
              Effect.forEach(currentListeners, (listener) => Effect.forkDaemon(listener(data)))
            ),
            Effect.asVoid
          ),
        off: (event) => Ref.update(listeners, (map) => HashMap.remove(map, event)).pipe(Effect.asVoid),
        on: (event, callback) =>
          getListeners(event).pipe(
            Effect.flatMap((queue) => Queue.offer(queue, callback)),
            Effect.asVoid
          ),
        once: (event, callback) =>
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
      })
    })
  )

export const EventEmitterTest = <Events extends Record<string, unknown>>() =>
  Layer.scoped(
    PortEventEmitter<Events>(),
    Effect.sync(() => {
      const listeners = new Map<keyof Events, Array<(data: any) => Effect.Effect<void>>>()
      const mock = {
        emit: <K extends keyof Events>(event: K, data: Events[K]) => {
          const handlers = listeners.get(event) || []
          return Effect.all(handlers.map((handler) => handler(data)), { concurrency: "unbounded" })
        },
        off: <K extends keyof Events>(event: K) => {
          listeners.delete(event)
          return Effect.void
        },
        on: <K extends keyof Events>(
          event: K,
          callback: (data: Events[K]) => Effect.Effect<void>
        ) => {
          if (!listeners.has(event)) {
            listeners.set(event, [])
          }
          listeners.get(event)!.push(callback)
          return Effect.void
        },
        once: <K extends keyof Events>(
          event: K,
          callback: (data: Events[K]) => Effect.Effect<void>
        ) => {
          const wrapper = (data: Events[K]) => {
            const eventListeners = listeners.get(event)
            if (eventListeners) {
              const index = eventListeners.indexOf(wrapper)
              if (index > -1) {
                eventListeners.splice(index, 1)
              }
            }
            return callback(data)
          }
          return mock.on(event, wrapper)
        }
      }

      return PortEventEmitter<Events>().of(mock)
    })
  )
