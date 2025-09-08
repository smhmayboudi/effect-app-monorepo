import { Config } from "effect"

const ClientShardManagerAddressLive = Config.nested(
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

const ClientSqliteLive = Config.nested(
  Config.all({
    filename: Config.string("FILENAME").pipe(
      Config.withDefault("./db-workflow.sqlite")
    )
  }),
  "SQLITE"
)

const WorkflowShardManagerAddressLive = Config.nested(
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

const WorkflowSqliteLive = Config.nested(
  Config.all({
    filename: Config.string("FILENAME").pipe(
      Config.withDefault("./db-workflow.sqlite")
    )
  }),
  "SQLITE"
)
const WorkflowLive = Config.nested(
  Config.all({
    ShardManagerAddress: WorkflowShardManagerAddressLive,
    Sqlite: WorkflowSqliteLive
  }),
  "WORKFLOW"
)

export const ClientConfigLive = Config.nested(
  Config.all({
    ShardManagerAddress: ClientShardManagerAddressLive,
    Sqlite: ClientSqliteLive,
    Workflow: WorkflowLive
  }),
  "CLIENT"
)

const ServerShardManagerAddressLive = Config.nested(
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

const ServerSqliteLive = Config.nested(
  Config.all({
    filename: Config.string("FILENAME").pipe(
      Config.withDefault("./db-workflow.sqlite")
    )
  }),
  "SQLITE"
)

export const ServerConfigLive = Config.nested(
  Config.all({
    ShardManagerAddress: ServerShardManagerAddressLive,
    Sqlite: ServerSqliteLive
  }),
  "SERVER"
)
