import * as Config from "effect/Config"

const ServerShardManagerAddressLive = Config.nested(
  Config.all({
    host: Config.string("HOST").pipe(
      Config.withDefault("127.0.0.1")
    ),
    port: Config.integer("PORT").pipe(
      Config.withDefault(8080)
    )
  }),
  "SHARD_MANAGER_ADDRESS"
)

const ServerSqliteLive = Config.nested(
  Config.all({
    filename: Config.string("FILENAME").pipe(
      Config.withDefault("./db-workflow.sqlite")
    )
  }),
  "SQLITE"
)

export const ConfigLive = Config.nested(
  Config.all({
    shardManagerAddress: ServerShardManagerAddressLive,
    sqlite: ServerSqliteLive
  }),
  "SHARD_MANAGER"
)
