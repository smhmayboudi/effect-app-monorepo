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

const ClientConfigLive = Config.nested(
  Config.all({
    runnerAddress: ClientRunnerAddressLive,
    shardManagerAddress: ClientShardManagerAddressLive,
    sqlite: ClientSqliteLive
  }),
  "CLIENT"
)

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

const ServerConfigLive = Config.nested(
  Config.all({
    shardManagerAddress: ServerShardManagerAddressLive,
    sqlite: ServerSqliteLive
  }),
  "SERVER"
)

export const WorkflowConfigLive = Config.nested(
  Config.all({
    client: ClientConfigLive,
    server: ServerConfigLive
  }),
  "WORKFLOW"
)
