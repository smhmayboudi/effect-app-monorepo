import { RunnerAddress } from "@effect/cluster"
import { NodeClusterShardManagerSocket, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, Logger, LogLevel } from "effect"
import { ConfigLive } from "./Config.js"
import { SqlLayer } from "./Sql.js"

Layer.mergeAll(
  Layer.unwrapEffect(
    ConfigLive.pipe(Effect.map((config) =>
      NodeClusterShardManagerSocket.layer({
        shardingConfig: {
          shardManagerAddress: RunnerAddress.make(
            config.ShardManagerAddress.host,
            config.ShardManagerAddress.port
          )
        },
        storage: "sql"
      })
    ))
  ),
  Logger.minimumLogLevel(LogLevel.Debug)
).pipe(
  Layer.provide(SqlLayer),
  Layer.orDie,
  Layer.launch,
  NodeRuntime.runMain
)
