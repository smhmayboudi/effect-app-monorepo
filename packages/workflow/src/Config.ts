import { Config } from "effect"

const ClientShardManagerAddress = Config.nested(
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

export const ClientConfig = Config.nested(
  Config.all({
    ShardManagerAddress: ClientShardManagerAddress
  }),
  "CLIENT"
)

const ServerShardManagerAddress = Config.nested(
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

export const ServerConfig = Config.nested(
  Config.all({
    ShardManagerAddress: ServerShardManagerAddress
  }),
  "SERVER"
)
