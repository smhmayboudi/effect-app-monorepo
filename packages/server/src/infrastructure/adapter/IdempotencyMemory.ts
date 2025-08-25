import { Effect, Layer, Option, Ref } from "effect"
import { type IdempotencyRecord, PortIdempotency } from "../application/PortIdempotency.js"

const idempotencyRef = Effect.runSync(Ref.make(new Map<string, IdempotencyRecord>()))

export const IdempotencyMemory = Layer.succeed(
  PortIdempotency,
  PortIdempotency.of({
    complete: (key, response) =>
      Effect.sync(() => new Date()).pipe(Effect.flatMap((now) =>
        Ref.update(idempotencyRef, (map) => {
          const newMap = new Map(map)
          const existing = newMap.get(key.value)
          if (existing) {
            newMap.set(key.value, {
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
          const existing = newMap.get(key.value)
          if (existing) {
            newMap.set(key.value, {
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
          Effect.succeed(Option.fromNullable(map.get(key.value) as IdempotencyRecord | undefined))
        )
      ),
    store: (key) =>
      Effect.sync(() => new Date()).pipe(
        Effect.flatMap((now) =>
          Ref.update(idempotencyRef, (map) =>
            new Map(map).set(key.value, {
              createdAt: now,
              key,
              status: "in_progress",
              updatedAt: now
            }))
        )
      )
  })
)
