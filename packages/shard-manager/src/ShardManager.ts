import * as RunnerAddress from "@effect/cluster/RunnerAddress"
import * as NodeClusterShardManagerHttp from "@effect/platform-node/NodeClusterShardManagerHttp"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Logger from "effect/Logger"
import * as LogLevel from "effect/LogLevel"
import { ConfigLive } from "./Config.js"
import { Sql } from "./Sql.js"

const gracefulShutdown = <A, E, R>(layer: Layer.Layer<A, E, R>) =>
  Layer.scopedDiscard(
    Effect.addFinalizer(() => Effect.logInfo("Graceful Shutdown"))
  ).pipe(
    Layer.provideMerge(layer)
  )

Layer.mergeAll(
  Layer.unwrapEffect(ConfigLive.pipe(Effect.map((config) =>
    NodeClusterShardManagerHttp.layer({
      shardingConfig: {
        shardManagerAddress: RunnerAddress.make(
          config.shardManagerAddress.host,
          config.shardManagerAddress.port
        )
      },
      storage: "sql",
      transport: "http"
    })
  ))),
  Logger.minimumLogLevel(LogLevel.Debug)
).pipe(
  Layer.provide(Sql(ConfigLive.pipe(Config.map((options) => options.sqlite)))),
  Layer.orDie,
  gracefulShutdown,
  Layer.launch,
  NodeRuntime.runMain
)
