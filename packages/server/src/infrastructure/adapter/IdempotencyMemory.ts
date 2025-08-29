import { Effect, Layer, Option, Ref } from "effect"
import { type IdempotencyKeyServer, type IdempotencyRecord, PortIdempotency } from "../application/PortIdempotency.js"

const idempotencyRef = Effect.runSync(Ref.make(new Map<string, IdempotencyRecord>()))

export const IdempotencyMemory = Layer.effect(
  PortIdempotency,
  Effect.sync(() => {
    const makeKey = (key: IdempotencyKeyServer) => `${key.clientKey}:${key.dataHash}`

    return PortIdempotency.of({
      complete: (key, response) =>
        Effect.sync(() => new Date()).pipe(Effect.flatMap((now) =>
          Ref.update(idempotencyRef, (map) => {
            const newMap = new Map(map)
            const existing = newMap.get(makeKey(key))
            if (existing) {
              newMap.set(makeKey(key), {
                ...existing,
                response,
                status: "completed",
                updatedAt: now
              })
            }

            return newMap
          })
        )),
      fail: (key) =>
        Effect.sync(() => new Date()).pipe(Effect.flatMap((now) =>
          Ref.update(idempotencyRef, (map) => {
            const newMap = new Map(map)
            const existing = newMap.get(makeKey(key))
            if (existing) {
              newMap.set(makeKey(key), {
                ...existing,
                status: "failed",
                updatedAt: now
              })
            }

            return newMap
          })
        )),
      retrieve: (key) =>
        Ref.get(idempotencyRef).pipe(
          Effect.flatMap((map) =>
            Effect.succeed(Option.fromNullable(map.get(makeKey(key)) as IdempotencyRecord | undefined))
          )
        ),
      store: (key) =>
        Effect.sync(() => new Date()).pipe(
          Effect.flatMap((now) =>
            Ref.update(idempotencyRef, (map) =>
              new Map(map).set(makeKey(key), {
                createdAt: now,
                key,
                status: "in_progress",
                updatedAt: now
              }))
          )
        )
    })
  })
)
