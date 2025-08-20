import { Chunk, Effect, HashMap, Queue, Ref } from "effect"
import { makeTestLayer } from "../../util/Layer.js"
import { type EventEmitter, PortEventEmitter } from "../application/PortEventEmitter.js"

export const make = <Events extends Record<string, any>>(): Effect.Effect<EventEmitter<Events>> =>
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

export const makeTest = <Events extends Record<string, any>>() => {
  const listeners = new Map<keyof Events, Array<(data: any) => Effect.Effect<void>>>()

  const mock: EventEmitter<Events> = {
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

  return makeTestLayer(PortEventEmitter<Events>())(mock)
}
