import { IdempotencyError } from "@template/domain/shared/application/IdempotencyError"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import * as Ref from "effect/Ref"
import type { IdempotencyKeyServer, IdempotencyRecord } from "../application/PortIdempotency.js"
import { PortIdempotency } from "../application/PortIdempotency.js"
import { PortRedis } from "../application/PortRedis.js"

export const IdempotencyRedis = (config: {
  readonly keyPrefix?: string
}) =>
  Layer.effect(
    PortIdempotency,
    PortRedis.pipe(
      Effect.flatMap((redis) =>
        Effect.sync(() => {
          const makeKey = (key: IdempotencyKeyServer) =>
            `${config.keyPrefix ?? "idempotency"}:${key.clientKey}:${key.dataHash}`
          const deserialize = (data: string): IdempotencyRecord => {
            const parsed = JSON.parse(data)
            return {
              ...parsed,
              createdAt: new Date(parsed.createdAt),
              updatedAt: new Date(parsed.updatedAt)
            }
          }
          const serialize = (record: IdempotencyRecord): string => JSON.stringify(record)

          return PortIdempotency.of({
            complete: (key, response) =>
              Effect.tryPromise({
                try: async () => {
                  const now = new Date()
                  const data = await redis.get(makeKey(key))
                  if (data) {
                    const existing = deserialize(data)
                    const record: IdempotencyRecord = {
                      ...existing,
                      response,
                      status: "completed",
                      updatedAt: now
                    }
                    await redis.set(makeKey(key), serialize(record), "EX", 86400)
                  }
                },
                catch: (error) => new IdempotencyError({ error, key: key.clientKey, text: "Failed to complete" })
              }),
            fail: (key) =>
              Effect.tryPromise({
                try: async () => {
                  const now = new Date()
                  const data = await redis.get(makeKey(key))
                  if (data) {
                    const existing = deserialize(data)
                    const updated: IdempotencyRecord = {
                      ...existing,
                      status: "failed",
                      updatedAt: now
                    }

                    await redis.set(makeKey(key), serialize(updated), "EX", 86400)
                  }
                },
                catch: (error) => new IdempotencyError({ error, key: key.clientKey, text: "Failed to fail" })
              }),
            retrieve: (key) =>
              Effect.tryPromise({
                try: async () => {
                  const data = await redis.get(makeKey(key))

                  return (data === null) ? Option.none() : Option.some(deserialize(data))
                },
                catch: (error) => new IdempotencyError({ error, key: key.clientKey, text: "Failed to retrieve" })
              }),
            store: (key) =>
              Effect.tryPromise({
                try: async () => {
                  const now = new Date()
                  const record: IdempotencyRecord = {
                    key,
                    status: "in_progress",
                    createdAt: now,
                    updatedAt: now
                  }
                  await redis.set(makeKey(key), serialize(record), "EX", 86400)
                },
                catch: (error) => new IdempotencyError({ error, key: key.clientKey, text: "Failed to store" })
              })
          })
        })
      )
    )
  )

const idempotencyRef = Effect.runSync(Ref.make(new Map<string, IdempotencyRecord>()))

export const IdempotencyTest = Layer.effect(
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
