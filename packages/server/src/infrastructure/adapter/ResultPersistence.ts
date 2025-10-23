import * as expPersistence from "@effect/experimental/Persistence"
import * as Redis from "@effect/experimental/Persistence/Redis"
import type * as Config from "effect/Config"
import * as Duration from "effect/Duration"
import * as Effect from "effect/Effect"
import type * as Exit from "effect/Exit"
import * as Option from "effect/Option"
import * as Scope from "effect/Scope"
import type { RedisOptions } from "ioredis"
import { makeTestLayer } from "../../util/Layer.js"

export const ResultPersistenceRedis = (options: Config.Config.Wrap<RedisOptions>) => Redis.layerResultConfig(options)

export const ResultPersistenceTest = makeTestLayer(expPersistence.ResultPersistence)({
  make: (options: {
    readonly storeId: string
    readonly timeToLive?: (
      key: expPersistence.ResultPersistence.KeyAny,
      exit: Exit.Exit<unknown, unknown>
    ) => Duration.DurationInput
  }): Effect.Effect<expPersistence.ResultPersistenceStore, never, Scope.Scope> =>
    Scope.make().pipe(
      Effect.flatMap((scope) => {
        const store = new Map<string, {
          value: Exit.Exit<unknown, unknown>
          expiresAt?: number | undefined
        }>()
        const interval = setInterval(() => {
          const now = Date.now()
          for (const [key, entry] of store.entries()) {
            if (entry.expiresAt !== undefined && entry.expiresAt <= now) {
              store.delete(key)
            }
          }
        }, 60_000)

        return Scope.addFinalizer(scope, Effect.sync(() => clearInterval(interval))).pipe(
          Effect.flatMap(() => {
            const getExpiration = (
              key: expPersistence.ResultPersistence.KeyAny,
              exit: Exit.Exit<unknown, unknown>
            ) => {
              if (!options.timeToLive) {
                return undefined
              }
              const ttl = options.timeToLive(key, exit)
              return Duration.toMillis(Duration.decode(ttl))
            }

            return Effect.sync(() => ({
              get: <R, IE, E, IA, A>(
                key: expPersistence.ResultPersistence.Key<R, IE, E, IA, A>
              ) =>
                Effect.sync(() => {
                  const entry = store.get(JSON.stringify(key))
                  if (!entry) {
                    return Option.none()
                  }

                  if (entry.expiresAt !== undefined && entry.expiresAt <= Date.now()) {
                    store.delete(JSON.stringify(key))
                    return Option.none()
                  }

                  return Option.some(entry.value as Exit.Exit<A, E>)
                }),
              getMany: <R, IE, E, IA, A>(
                keys: ReadonlyArray<expPersistence.ResultPersistence.Key<R, IE, E, IA, A>>
              ) =>
                Effect.sync(() =>
                  keys.map((key) => {
                    const entry = store.get(JSON.stringify(key))
                    if (!entry) {
                      return Option.none()
                    }

                    if (entry.expiresAt !== undefined && entry.expiresAt <= Date.now()) {
                      store.delete(JSON.stringify(key))
                      return Option.none()
                    }

                    return Option.some(entry.value as Exit.Exit<A, E>)
                  })
                ),
              set: <R, IE, E, IA, A>(
                key: expPersistence.ResultPersistence.Key<R, IE, E, IA, A>,
                value: Exit.Exit<A, E>
              ) =>
                Effect.sync(() => {
                  const ttl = getExpiration(key, value)
                  const expiresAt = ttl !== undefined ? Date.now() + ttl : undefined
                  store.set(JSON.stringify(key), {
                    value,
                    expiresAt
                  })
                }),
              setMany: <R, IE, E, IA, A>(
                entries: Iterable<readonly [expPersistence.ResultPersistence.Key<R, IE, E, IA, A>, Exit.Exit<A, E>]>
              ) =>
                Effect.sync(() => {
                  for (const [key, value] of entries) {
                    const ttl = getExpiration(key, value)
                    const expiresAt = ttl !== undefined ? Date.now() + ttl : undefined
                    store.set(JSON.stringify(key), {
                      value,
                      expiresAt
                    })
                  }
                }),
              remove: <R, IE, E, IA, A>(
                key: expPersistence.ResultPersistence.Key<R, IE, E, IA, A>
              ) =>
                Effect.sync(() => {
                  store.delete(JSON.stringify(key))
                }),
              clear: Effect.sync(() => {
                store.clear()
              })
            }))
          })
        )
      })
    )
})
