import { ClusterWorkflowEngine } from "@effect/cluster"
import { NodeClusterRunnerSocket, NodeRuntime } from "@effect/platform-node"
import { Config, Effect, Layer, Logger, LogLevel } from "effect"
import { ClientConfigLive } from "./Config.js"
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
  Layer.provide(NodeClusterRunnerSocket.layer({ storage: "sql" })),
  Layer.provide(Sql(ClientConfigLive.pipe(Config.map((options) => options.Sqlite)))),
  gracefulShutdown,
  Layer.launch,
  NodeRuntime.runMain
)
