import { Config } from "effect"

export const PersonConfig = Config.nested(
  Config.all({
    cacheTTLMs: Config.integer("CACHE_TTL_MS").pipe(
      Config.withDefault(30_000)
    )
  }),
  "PERSON"
)
