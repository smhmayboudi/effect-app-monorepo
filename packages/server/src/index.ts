import { NodeSdk } from "@effect/opentelemetry"
import { HttpApiBuilder, HttpApiScalar, HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { ApiLive } from "@template/server/api"
import { Layer } from "effect"
import { createServer } from "node:http"

const NodeSdkLive = NodeSdk.layer(() => ({
  logRecordProcessor: new BatchLogRecordProcessor(new OTLPLogExporter()),
  metricReader: new PeriodicExportingMetricReader({ exporter: new OTLPMetricExporter() }),
  resource: { serviceName: "effect-app-monorepo", serviceVersion: "0.0.0" },
  spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter())
}))

const HttpApiLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(NodeSdkLive),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi({ path: "/openapi.json" })),
  Layer.provide(HttpApiScalar.layer({ path: "/references" })),
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3001 }))
)

Layer.launch(HttpApiLive).pipe(NodeRuntime.runMain)
