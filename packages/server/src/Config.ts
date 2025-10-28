import * as Config from "effect/Config"

const ElasticsearchLive = Config.nested(
  Config.all({
    node: Config.string("NODE").pipe(
      Config.withDefault("http://127.0.0.1:9200")
    )
  }),
  "ELASTICSEARCH"
)

const RedisLive = Config.nested(
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

const SqliteLive = Config.nested(
  Config.all({
    filename: Config.string("FILENAME").pipe(
      Config.withDefault("./db-server.sqlite")
    )
  }),
  "SQLITE"
)

const WorkflowShardManagerAddressLive = Config.nested(
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
    shardManagerAddress: WorkflowShardManagerAddressLive,
    sqlite: WorkflowSqliteLive
  }),
  "RUNNER"
)

export const ConfigLive = Config.nested(
  Config.all({
    elasticsearch: ElasticsearchLive,
    redis: RedisLive,
    sqlite: SqliteLive,
    workflow: WorkflowLive
  }),
  "SERVER"
)
