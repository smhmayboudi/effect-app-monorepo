import { layerResultConfig } from "@effect/experimental/Persistence/Redis"
import { Config } from "effect"

const RedisConfig = Config.nested(
  Config.all({
    host: Config.string("HOST").pipe(
      Config.withDefault("127.0.0.1")
    ),
    port: Config.integer("PORT").pipe(
      Config.withDefault(6379)
    )
  }),
  "REDIS"
)

export const Redis = layerResultConfig(RedisConfig)
