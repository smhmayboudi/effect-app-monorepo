import * as Config from "effect/Config"

export const ServiceConfig = Config.nested(
  Config.all({
    cacheTTLMs: Config.integer("CACHE_TTL_MS").pipe(
      Config.withDefault(30_000)
    )
  }),
  "SERVER_SERVICE"
)
