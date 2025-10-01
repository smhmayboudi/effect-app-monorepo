import { ClusterWorkflowEngine, RunnerAddress } from "@effect/cluster"
import { NodeClusterRunnerHttp } from "@effect/platform-node"
import { Config, Effect, Layer } from "effect"
import { WorkflowConfigLive } from "./Config.js"
import { Sql } from "./Sql.js"

const ShardingLayer = Layer.unwrapEffect(WorkflowConfigLive.pipe(Effect.map((config) =>
  NodeClusterRunnerHttp.layer({
    clientOnly: true,
    shardingConfig: {
      shardManagerAddress: RunnerAddress.make(
        config.client.shardManagerAddress.host,
        config.client.shardManagerAddress.port
      )
    },
    storage: "sql",
    transport: "http"
  })
))).pipe(
  Layer.provide(Sql(WorkflowConfigLive.pipe(Config.map((options) => options.client.sqlite))))
  // Layer.orDie
)

export const WorkflowEngineLayer = ClusterWorkflowEngine.layer.pipe(
  Layer.provide(ShardingLayer)
)
