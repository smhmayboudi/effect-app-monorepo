import { IdempotencyError } from "@template/domain/shared/application/IdempotencyError"
import { Effect, Layer, Option } from "effect"
import type { IdempotencyRecord } from "../application/PortIdempotency.js"
import { PortIdempotency } from "../application/PortIdempotency.js"
import { PortRedis } from "../application/PortRedis.js"

export interface RedisConfig {
  readonly prefix?: string
}

export const IdempotencyRedis = (config?: RedisConfig) =>
  Layer.effect(
    PortIdempotency,
    PortRedis.pipe(
      Effect.flatMap((redis) =>
        Effect.sync(() => {
          const deserialize = (data: string): IdempotencyRecord => {
            const parsed = JSON.parse(data)
            return {
              ...parsed,
              createdAt: new Date(parsed.createdAt),
              updatedAt: new Date(parsed.updatedAt)
            }
          }
          const prefix = (config?: RedisConfig) => config?.prefix ?? "idempotency:"
          const serialize = (record: IdempotencyRecord): string => JSON.stringify(record)

          return PortIdempotency.of({
            complete: (key, response) =>
              Effect.tryPromise({
                try: async () => {
                  const now = new Date()
                  const data = await redis.get(`${prefix(config)}${key.value}`)
                  if (data) {
                    const existing = deserialize(data)
                    const record: IdempotencyRecord = {
                      ...existing,
                      response,
                      status: "completed",
                      updatedAt: now
                    }
                    await redis.set(`${prefix(config)}${key.value}`, serialize(record), "EX", 86400)
                  }
                },
                catch: (error) => new IdempotencyError({ error, key: key.clientKey, text: "Failed to complete" })
              }),
            fail: (key) =>
              Effect.tryPromise({
                try: async () => {
                  const now = new Date()
                  const data = await redis.get(`${prefix(config)}${key.value}`)
                  if (data) {
                    const existing = deserialize(data)
                    const updated: IdempotencyRecord = {
                      ...existing,
                      status: "failed",
                      updatedAt: now
                    }

                    await redis.set(`${prefix(config)}${key.value}`, serialize(updated), "EX", 86400)
                  }
                },
                catch: (error) => new IdempotencyError({ error, key: key.clientKey, text: "Failed to fail" })
              }),
            retrieve: (key) =>
              Effect.tryPromise({
                try: async () => {
                  const data = await redis.get(`${prefix(config)}${key.value}`)

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
                  await redis.set(`${prefix(config)}${key.value}`, serialize(record), "EX", 86400)
                },
                catch: (error) => new IdempotencyError({ error, key: key.clientKey, text: "Failed to store" })
              })
          })
        })
      )
    )
  )
