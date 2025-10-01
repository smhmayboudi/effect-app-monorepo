import { RunnerAddress } from "@effect/cluster"
import { NodeClusterShardManagerHttp, NodeRuntime } from "@effect/platform-node"
import { Config, Effect, Layer, Logger, LogLevel } from "effect"
import { WorkflowConfigLive } from "./Config.js"
import { Sql } from "./Sql.js"

const gracefulShutdown = <A, E, R>(layer: Layer.Layer<A, E, R>) =>
  Layer.scopedDiscard(
    Effect.addFinalizer(() => Effect.logInfo("Graceful Shutdown"))
  ).pipe(
    Layer.provideMerge(layer)
  )

Layer.mergeAll(
  Layer.unwrapEffect(WorkflowConfigLive.pipe(Effect.map((config) =>
    NodeClusterShardManagerHttp.layer({
      shardingConfig: {
        shardManagerAddress: RunnerAddress.make(
          config.server.shardManagerAddress.host,
          config.server.shardManagerAddress.port
        )
      },
      storage: "sql",
      transport: "http"
    })
  ))),
  Logger.minimumLogLevel(LogLevel.Debug)
).pipe(
  Layer.provide(Sql(WorkflowConfigLive.pipe(Config.map((options) => options.server.sqlite)))),
  // Layer.orDie,
  gracefulShutdown,
  Layer.launch,
  NodeRuntime.runMain
)
