import { SSE } from "@template/domain/sse/application/SseApplicationDomain"
import type { UserId } from "@template/domain/user/application/UserApplicationDomain"
import { Array, Effect, Layer, MutableHashMap, Option, type Queue, Ref, Schema } from "effect"
import { PortSSEManager } from "../application/port-sse-manager.js"

interface ActiveConnection {
  readonly connectionId: string
  readonly queue: Queue.Queue<string>
}

export const SSEManager = Layer.effect(
  PortSSEManager,
  Effect.gen(function*() {
    const connectionsRef = yield* Ref.make(MutableHashMap.empty<UserId, Array<ActiveConnection>>())

    const notifyAll = (event: SSE): Effect.Effect<void, never, never> =>
      Effect.gen(function*() {
        const connections = yield* Ref.get(connectionsRef)
        const connectionsAll = Array.flatten(MutableHashMap.values(connections))

        if (connectionsAll.length === 0) {
          return
        }

        const encodedEvent = yield* Schema.encode(Schema.parseJson(SSE))(event).pipe(
          Effect.orDie
        )

        yield* Effect.forEach(
          connectionsAll,
          (connection) => connection.queue.offer(encodedEvent),
          {
            concurrency: "unbounded",
            discard: true
          }
        )
      })

    const notifyUser = (event: SSE, id: UserId) =>
      Effect.gen(function*() {
        const connections = yield* Ref.get(connectionsRef)
        const connectionsUser = MutableHashMap.get(connections, id)
        if (Option.isNone(connectionsUser) || connectionsUser.value.length === 0) {
          return
        }

        const encodedEvent = yield* Schema.encode(Schema.parseJson(SSE))(event).pipe(
          Effect.orDie
        )

        yield* Effect.forEach(
          connectionsUser.value,
          (connection) => connection.queue.offer(encodedEvent),
          {
            concurrency: "unbounded",
            discard: true
          }
        )
      })

    const registerConnection = (
      connectionId: string,
      queue: Queue.Queue<string>,
      id: UserId
    ): Effect.Effect<void, never, never> =>
      Ref.update(
        connectionsRef,
        (map) =>
          MutableHashMap.modifyAt(map, id, (activeConnections) =>
            activeConnections.pipe(
              Option.map(Array.append({ connectionId, queue })),
              Option.orElse(() => Option.some(Array.make({ connectionId, queue })))
            ))
      )

    const unregisterConnection = (connectionId: string, id: UserId): Effect.Effect<void, never, never> =>
      Ref.modify(connectionsRef, (map) => {
        const connectionToRemove = MutableHashMap.get(map, id).pipe(
          Option.flatMap((connections) =>
            Array.findFirst(connections, (connection) => connection.connectionId === connectionId)
          )
        )

        if (Option.isNone(connectionToRemove)) {
          return [Effect.void, map] as const
        }

        return [
          connectionToRemove.value.queue.shutdown,
          map.pipe(
            MutableHashMap.modify(
              id,
              Array.filter((connection) => connection.connectionId !== connectionId)
            )
          )
        ] as const
      }).pipe(Effect.flatten)

    return {
      notifyAll,
      notifyUser,
      registerConnection,
      unregisterConnection
    }
  })
)
