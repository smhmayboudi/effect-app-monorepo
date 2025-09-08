import type { ActorId } from "@template/domain/Actor"
import { SSE } from "@template/domain/sse/application/SSEApplicationDomain"
import { Array, Effect, Layer, MutableHashMap, Option, type Queue, Ref, Schema } from "effect"
import { PortSSEManager } from "../application/PortSSEManager.js"

interface ActiveConnection {
  readonly connectionId: string
  readonly queue: Queue.Queue<string>
}

export const SSEManager = Layer.effect(
  PortSSEManager,
  Ref.make(MutableHashMap.empty<ActorId, Array<ActiveConnection>>()).pipe(
    Effect.flatMap((connectionsRef) =>
      Effect.sync(() =>
        PortSSEManager.of({
          notifyAll: (event) =>
            Ref.get(connectionsRef).pipe(Effect.flatMap((connections) => {
              const connectionsAll = Array.flatten(MutableHashMap.values(connections))

              if (connectionsAll.length === 0) {
                return Effect.void
              }
              return Schema.encode(Schema.parseJson(SSE))(event).pipe(Effect.orDie).pipe(
                Effect.flatMap(
                  (encodedEvent) =>
                    Effect.forEach(
                      connectionsAll,
                      (connection) => connection.queue.offer(encodedEvent),
                      {
                        concurrency: "unbounded",
                        discard: true
                      }
                    )
                )
              )
            })),
          notifyUser: (event, id) =>
            Ref.get(connectionsRef).pipe(Effect.flatMap((connections) => {
              const connectionsUser = MutableHashMap.get(connections, id)
              if (Option.isNone(connectionsUser) || connectionsUser.value.length === 0) {
                return Effect.void
              }

              return Schema.encode(Schema.parseJson(SSE))(event).pipe(Effect.orDie).pipe(
                Effect.flatMap(
                  (encodedEvent) =>
                    Effect.forEach(
                      connectionsUser.value,
                      (connection) => connection.queue.offer(encodedEvent),
                      {
                        concurrency: "unbounded",
                        discard: true
                      }
                    )
                )
              )
            })),
          registerConnection: (connectionId, queue, id) =>
            connectionsRef.pipe(
              Ref.update((map) =>
                MutableHashMap.modifyAt(map, id, (activeConnections) =>
                  activeConnections.pipe(
                    Option.map(Array.append({ connectionId, queue })),
                    Option.orElse(() => Option.some(Array.make({ connectionId, queue })))
                  ))
              )
            ),
          unregisterConnection: (connectionId, id) =>
            connectionsRef.pipe(Ref.modify((map) => {
              const connectionToRemove = MutableHashMap.get(map, id).pipe(
                Option.flatMap((connections) =>
                  Array.findFirst(connections, (connection) => connection.connectionId === connectionId)
                )
              )
              if (Option.isNone(connectionToRemove)) {
                return [Effect.void, map]
              }

              return [
                connectionToRemove.value.queue.shutdown,
                map.pipe(
                  MutableHashMap.modify(
                    id,
                    Array.filter((connection) => connection.connectionId !== connectionId)
                  )
                )
              ]
            })).pipe(Effect.flatten)
        })
      )
    )
  )
)
