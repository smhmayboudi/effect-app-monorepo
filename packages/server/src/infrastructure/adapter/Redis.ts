import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import type { RedisOptions } from "ioredis"
import { Redis as RedisOriginal } from "ioredis"
import { PortRedis } from "../application/PortRedis.js"

export const Redis = (options: Config.Config.Wrap<RedisOptions>) =>
  Layer.scoped(
    PortRedis,
    Effect.acquireRelease(
      Config.unwrap(options).pipe(Effect.map((opts) => new RedisOriginal(opts))),
      (client) => Effect.sync(() => client.disconnect())
    )
  )
