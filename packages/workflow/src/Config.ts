import { Config } from "effect"

const ShardManagerAddress = Config.nested(
  Config.all({
    host: Config.string("HOST").pipe(
      Config.withDefault("localhost")
    ),
    port: Config.integer("PORT").pipe(
      Config.withDefault(8080)
    )
  }),
  "SHARD_MANAGER_ADDRESS"
)

export const ConfigLive = Config.nested(
  Config.all({
    ShardManagerAddress
  }),
  "CLIENT"
)
