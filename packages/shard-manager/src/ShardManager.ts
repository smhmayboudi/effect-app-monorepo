import * as RunnerAddress from "@effect/cluster/RunnerAddress"
import * as NodeSdk from "@effect/opentelemetry/NodeSdk"
import * as NodeClusterShardManagerHttp from "@effect/platform-node/NodeClusterShardManagerHttp"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Logger from "effect/Logger"
import * as LogLevel from "effect/LogLevel"
import { ConfigLive } from "./Config.js"
import { Sql } from "./Sql.js"

const NodeSdkLive = NodeSdk.layer(() => ({
  logRecordProcessor: new BatchLogRecordProcessor(new OTLPLogExporter()),
  metricReader: new PeriodicExportingMetricReader({ exporter: new OTLPMetricExporter() }),
  resource: { serviceName: "shard-manager", serviceVersion: "0.0.0" },
  spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter())
}))

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
  Layer.provide(NodeSdkLive),
  Layer.provide(Sql(ConfigLive.pipe(Config.map((options) => options.sqlite)))),
  Layer.orDie,
  gracefulShutdown,
  Layer.launch,
  NodeRuntime.runMain
)
