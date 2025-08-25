import { NodeSdk } from "@effect/opentelemetry"
import { HttpApiBuilder, HttpApiScalar, HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeContext, NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { Effect, flow, Layer, Logger, LogLevel } from "effect"
import { Redis } from "ioredis"
import { createServer } from "node:http"
import { ApiLive } from "./Api.js"
import { IdempotencyRedis } from "./infrastructure/adapter/IdempotencyRedis.js"
import { MiddlewareIdempotency } from "./middleware/MiddlewareIdempotency.js"
import { MiddlewareMetric } from "./middleware/MiddlewareMetric.js"

const NodeSdkLive = NodeSdk.layer(() => ({
  logRecordProcessor: new BatchLogRecordProcessor(new OTLPLogExporter()),
  metricReader: new PeriodicExportingMetricReader({ exporter: new OTLPMetricExporter() }),
  resource: { serviceName: "effect-app-monorepo", serviceVersion: "0.0.0" },
  spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter())
}))

const gracefulShutdown = <A, E, R>(layer: Layer.Layer<A, E, R>) =>
  Layer.scopedDiscard(
    Effect.addFinalizer(() => Effect.logInfo("Graceful Shutdown"))
  ).pipe(
    Layer.provideMerge(layer)
  )

const HttpApiLive = HttpApiBuilder.serve(flow(
  HttpMiddleware.cors({
    allowedOrigins: ["*"],
    allowedMethods: ["DELETE", "GET", "OPTION", "PATCH", "POST", "PUT"],
    allowedHeaders: ["authorization", "b3", "content-type", "traceparent", "idempotency-key"],
    credentials: true
  }),
  MiddlewareIdempotency,
  HttpMiddleware.logger,
  MiddlewareMetric
)).pipe(
  Layer.provide(NodeSdkLive),
  Layer.provide(HttpApiBuilder.middlewareOpenApi({ path: "/openapi.json" })),
  Layer.provide(HttpApiScalar.layer({ path: "/references" })),
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(ApiLive),
  Layer.provide(NodeContext.layer),
  Layer.provide(IdempotencyRedis({ redis: new Redis({ host: "127.0.0.1" }) })),
  Layer.provide(Logger.minimumLogLevel(LogLevel.Debug)),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3001 })),
  gracefulShutdown
)

Layer.launch(HttpApiLive).pipe(NodeRuntime.runMain)
