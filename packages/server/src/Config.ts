import { Config } from "effect"

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

export const ConfigLive = Config.nested(
  Config.all({
    Elasticsearch: ElasticsearchLive,
    Redis: RedisLive,
    Sqlite: SqliteLive
  }),
  "CLIENT"
)
