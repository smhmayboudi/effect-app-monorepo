import { ClusterWorkflowEngine } from "@effect/cluster"
import { NodeClusterRunnerSocket, NodeRuntime } from "@effect/platform-node"
import { Config, Layer, Logger, LogLevel } from "effect"
import { ClientConfigLive } from "./Config.js"
import { Sql } from "./Sql.js"
import { WorkflowSendEmailLayer } from "./WorkflowSendEmail.js"

Layer.mergeAll(
  WorkflowSendEmailLayer,
  Logger.minimumLogLevel(LogLevel.Debug)
).pipe(
  Layer.provide(ClusterWorkflowEngine.layer),
  Layer.provide(NodeClusterRunnerSocket.layer({ storage: "sql" })),
  Layer.provide(Sql(ClientConfigLive.pipe(Config.map((options) => options.Sqlite)))),
  Layer.launch,
  NodeRuntime.runMain
)
