import { ClusterWorkflowEngine, RunnerAddress } from "@effect/cluster"
import { NodeClusterRunnerSocket } from "@effect/platform-node"
import { Config, Effect, Layer } from "effect"
import { ClientConfigLive } from "./Config.js"
import { Sql } from "./Sql.js"

const ShardingLayer = Layer.unwrapEffect(ClientConfigLive.pipe(Effect.map((config) =>
  NodeClusterRunnerSocket.layer({
    clientOnly: true,
    shardingConfig: {
      shardManagerAddress: RunnerAddress.make(
        config.Workflow.ShardManagerAddress.host,
        config.Workflow.ShardManagerAddress.port
      )
    },
    storage: "sql"
  })
))).pipe(
  Layer.provide(Sql(ClientConfigLive.pipe(Config.map((options) => options.Workflow.Sqlite)))),
  Layer.orDie
)

export const WorkflowEngineLayer = ClusterWorkflowEngine.layer.pipe(
  Layer.provide(ShardingLayer)
)
