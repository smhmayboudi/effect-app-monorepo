import { ClusterWorkflowEngine, RunnerAddress } from "@effect/cluster"
import { NodeClusterRunnerSocket } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import { ClientConfig } from "./Config.js"
import { SqlLayer } from "./Sql.js"

const ShardingLayer = Layer.unwrapEffect(ClientConfig.pipe(Effect.map((config) =>
  NodeClusterRunnerSocket.layer({
    clientOnly: true,
    shardingConfig: {
      shardManagerAddress: RunnerAddress.make(
        config.ShardManagerAddress.host,
        config.ShardManagerAddress.port
      )
    },
    storage: "sql"
  })
))).pipe(
  Layer.provide(SqlLayer),
  Layer.orDie
)

export const WorkflowEngineLayer = ClusterWorkflowEngine.layer.pipe(
  Layer.provide(ShardingLayer)
)
