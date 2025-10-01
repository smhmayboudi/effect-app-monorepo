import { RunnerAddress } from "@effect/cluster"
import { NodeClusterShardManagerSocket, NodeRuntime } from "@effect/platform-node"
import { Config, Effect, Layer, Logger, LogLevel } from "effect"
import { ServerConfigLive } from "./Config.js"
import { Sql } from "./Sql.js"

const gracefulShutdown = <A, E, R>(layer: Layer.Layer<A, E, R>) =>
  Layer.scopedDiscard(
    Effect.addFinalizer(() => Effect.logInfo("Graceful Shutdown"))
  ).pipe(
    Layer.provideMerge(layer)
  )

Layer.mergeAll(
  Layer.unwrapEffect(ServerConfigLive.pipe(Effect.map((config) =>
    NodeClusterShardManagerSocket.layer({
      shardingConfig: {
        shardManagerAddress: RunnerAddress.make(
          config.ShardManagerAddress.host,
          config.ShardManagerAddress.port
        )
      },
      storage: "sql"
    })
  ))),
  Logger.minimumLogLevel(LogLevel.Debug)
).pipe(
  Layer.provide(Sql(ServerConfigLive.pipe(Config.map((options) => options.Sqlite)))),
  Layer.orDie,
  gracefulShutdown,
  Layer.launch,
  NodeRuntime.runMain
)
