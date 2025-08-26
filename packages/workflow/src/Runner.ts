import { ClusterWorkflowEngine } from "@effect/cluster"
import { NodeClusterRunnerSocket, NodeRuntime } from "@effect/platform-node"
import { Layer, Logger, LogLevel } from "effect"
import { SqlLayer } from "./Sql.js"
import { WorkflowSendEmailLayer } from "./WorkflowSendEmail.js"

Layer.mergeAll(
  WorkflowSendEmailLayer,
  Logger.minimumLogLevel(LogLevel.Debug)
).pipe(
  Layer.provide(ClusterWorkflowEngine.layer),
  Layer.provide(NodeClusterRunnerSocket.layer({ storage: "sql" })),
  Layer.provide(SqlLayer),
  Layer.launch,
  NodeRuntime.runMain
)
