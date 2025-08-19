import { NodeSdk } from "@effect/opentelemetry"
import { HttpApiBuilder, HttpApiScalar, HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeContext, NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { flow, Layer, Logger, LogLevel } from "effect"
import { createServer } from "node:http"
import { ApiLive } from "./Api.js"
import { MiddlewareMetric } from "./MiddlewareMetric.js"

const NodeSdkLive = NodeSdk.layer(() => ({
  logRecordProcessor: new BatchLogRecordProcessor(new OTLPLogExporter()),
  metricReader: new PeriodicExportingMetricReader({ exporter: new OTLPMetricExporter() }),
  resource: { serviceName: "effect-app-monorepo", serviceVersion: "0.0.0" },
  spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter())
}))

const HttpApiLive = HttpApiBuilder.serve(flow(HttpMiddleware.logger, MiddlewareMetric)).pipe(
  Layer.provide(NodeSdkLive),
  Layer.provide(HttpApiBuilder.middlewareCors({
    allowedOrigins: ["*"],
    allowedMethods: ["DELETE", "GET", "OPTION", "PATCH", "POST", "PUT"],
    allowedHeaders: ["Authorization", "B3", "Content-Type", "traceparent"],
    credentials: true
  })),
  Layer.provide(HttpApiBuilder.middlewareOpenApi({ path: "/openapi.json" })),
  Layer.provide(HttpApiScalar.layer({ path: "/references" })),
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(ApiLive),
  Layer.provide(NodeContext.layer),
  Layer.provide(Logger.minimumLogLevel(LogLevel.Debug)),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3001 }))
)

Layer.launch(HttpApiLive).pipe(NodeRuntime.runMain)
