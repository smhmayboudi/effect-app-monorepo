import { ClusterWorkflowEngine, RunnerAddress } from "@effect/cluster"
import { NodeClusterRunnerHttp, NodeRuntime } from "@effect/platform-node"
import { Config, Effect, Layer, Logger, LogLevel, Option } from "effect"
import { WorkflowConfigLive } from "./Config.js"
import { Sql } from "./Sql.js"
import { WorkflowSendEmailLayer } from "./WorkflowSendEmail.js"

const gracefulShutdown = <A, E, R>(layer: Layer.Layer<A, E, R>) =>
  Layer.scopedDiscard(
    Effect.addFinalizer(() => Effect.logInfo("Graceful Shutdown"))
  ).pipe(
    Layer.provideMerge(layer)
  )

Layer.mergeAll(
  WorkflowSendEmailLayer,
  Logger.minimumLogLevel(LogLevel.Debug)
).pipe(
  Layer.provide(ClusterWorkflowEngine.layer),
  Layer.provide(
    Layer.unwrapEffect(WorkflowConfigLive.pipe(Effect.map((config) =>
      NodeClusterRunnerHttp.layer({
        shardingConfig: {
          runnerAddress: Option.some(RunnerAddress.make(
            config.client.runnerAddress.host,
            config.client.runnerAddress.port
          )),
          shardManagerAddress: RunnerAddress.make(
            config.client.shardManagerAddress.host,
            config.client.shardManagerAddress.port
          )
        },
        storage: "sql",
        transport: "http"
      })
    )))
  ),
  Layer.provide(Sql(WorkflowConfigLive.pipe(Config.map((options) => options.client.sqlite)))),
  gracefulShutdown,
  Layer.launch,
  NodeRuntime.runMain
)
