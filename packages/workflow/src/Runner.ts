import * as ClusterWorkflowEngine from "@effect/cluster/ClusterWorkflowEngine"
import * as RunnerAddress from "@effect/cluster/RunnerAddress"
import * as NodeClusterRunnerHttp from "@effect/platform-node/NodeClusterRunnerHttp"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Logger from "effect/Logger"
import * as LogLevel from "effect/LogLevel"
import * as Option from "effect/Option"
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
