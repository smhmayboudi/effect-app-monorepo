import * as ClusterWorkflowEngine from "@effect/cluster/ClusterWorkflowEngine"
import * as RunnerAddress from "@effect/cluster/RunnerAddress"
import * as NodeClusterRunnerHttp from "@effect/platform-node/NodeClusterRunnerHttp"
import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { ConfigLive } from "./Config.js"
import { Sql } from "./Sql.js"

const ShardingLayer = Layer.unwrapEffect(ConfigLive.pipe(Effect.map((config) =>
  NodeClusterRunnerHttp.layer({
    clientOnly: true,
    shardingConfig: {
      shardManagerAddress: RunnerAddress.make(
        config.shardManagerAddress.host,
        config.shardManagerAddress.port
      )
    },
    storage: "sql",
    transport: "http"
  })
))).pipe(
  Layer.provide(Sql(ConfigLive.pipe(Config.map((options) => options.sqlite)))),
  Layer.orDie
)

export const WorkflowEngineLayer = ClusterWorkflowEngine.layer.pipe(
  Layer.provide(ShardingLayer)
)
