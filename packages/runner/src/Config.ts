import * as Config from "effect/Config"

const ClientRunnerAddressLive = Config.nested(
  Config.all({
    host: Config.string("HOST").pipe(
      Config.withDefault("127.0.0.1")
    ),
    port: Config.integer("PORT").pipe(
      Config.withDefault(8088)
    )
  }),
  "RUNNER_ADDRESS"
)

const ClientShardManagerAddressLive = Config.nested(
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

const ClientSqliteLive = Config.nested(
  Config.all({
    filename: Config.string("FILENAME").pipe(
      Config.withDefault("./db-workflow.sqlite")
    )
  }),
  "SQLITE"
)

export const ConfigLive = Config.nested(
  Config.all({
    runnerAddress: ClientRunnerAddressLive,
    shardManagerAddress: ClientShardManagerAddressLive,
    sqlite: ClientSqliteLive
  }),
  "RUNNER"
)
