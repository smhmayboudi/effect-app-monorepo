import { DomainSSE } from "@template/domain/sse/application/domain-sse"
import type { UserId } from "@template/domain/user/application/domain-user"
import { PortSSEManager } from "@template/server/infrastructure/application/port/sse-manager"
import { Array, Effect, Layer, MutableHashMap, Option, type Queue, Ref, Schema } from "effect"

interface ActiveConnection {
  readonly connectionId: string
  readonly queue: Queue.Queue<string>
}

export const SSEManager = Layer.effect(
  PortSSEManager,
  Effect.gen(function*() {
    const connectionsRef = yield* Ref.make(MutableHashMap.empty<UserId, Array<ActiveConnection>>())

    const notifyAll = ({ event }: { event: DomainSSE }): Effect.Effect<void, never, never> =>
      Effect.gen(function*() {
        const connections = yield* Ref.get(connectionsRef)
        const connectionsAll = Array.flatten(MutableHashMap.values(connections))

        if (connectionsAll.length === 0) {
          return
        }

        const encodedEvent = yield* Schema.encode(Schema.parseJson(DomainSSE))(event).pipe(
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

    const notifyUser = ({ event, userId }: { userId: UserId; event: DomainSSE }) =>
      Effect.gen(function*() {
        const connections = yield* Ref.get(connectionsRef)
        const connectionsUser = MutableHashMap.get(connections, userId)
        if (Option.isNone(connectionsUser) || connectionsUser.value.length === 0) {
          return
        }

        const encodedEvent = yield* Schema.encode(Schema.parseJson(DomainSSE))(event).pipe(
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

    const registerConnection = ({
      connectionId,
      queue,
      userId
    }: {
      userId: UserId
      connectionId: string
      queue: Queue.Queue<string>
    }): Effect.Effect<void, never, never> =>
      Ref.update(
        connectionsRef,
        (map) =>
          MutableHashMap.modifyAt(map, userId, (activeConnections) =>
            activeConnections.pipe(
              Option.map(Array.append({ connectionId, queue })),
              Option.orElse(() => Option.some(Array.make({ connectionId, queue })))
            ))
      )

    const unregisterConnection = ({
      connectionId,
      userId
    }: {
      userId: UserId
      connectionId: string
    }): Effect.Effect<void, never, never> =>
      Ref.modify(connectionsRef, (map) => {
        const connectionToRemove = MutableHashMap.get(map, userId).pipe(
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
              userId,
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
