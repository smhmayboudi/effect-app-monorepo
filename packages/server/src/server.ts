import { NodeSdk } from "@effect/opentelemetry"
import { HttpApiBuilder, HttpApiScalar, HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeContext, NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { Config, Effect, flow, Layer, Logger, LogLevel } from "effect"
import * as http from "node:http"
import { ApiLive } from "./Api.js"
import { ConfigLive } from "./Config.js"
import { IdempotencyRedis } from "./infrastructure/adapter/Idempotency.js"
import { Redis } from "./infrastructure/adapter/Redis.js"
import { MiddlewareAuthenticationRoute } from "./middleware/MiddlewareAuthenticationRoute.js"
import { MiddlewareIdempotency } from "./middleware/MiddlewareIdempotency.js"
import { MiddlewareMetric } from "./middleware/MiddlewareMetric.js"
import { TextDecoder } from "./util/TextDecoder.js"

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

HttpApiBuilder.serve(flow(
  HttpMiddleware.cors({
    allowedOrigins: ["http://127.0.0.1:3001", "http://127.0.0.1:3002"],
    allowedMethods: ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"],
    allowedHeaders: ["authorization", "b3", "content-type", "idempotency-key", "traceparent"],
    exposedHeaders: ["authorization", "content-type"],
    credentials: true,
    maxAge: 86400
  }),
  MiddlewareIdempotency,
  HttpMiddleware.logger,
  MiddlewareMetric,
  MiddlewareAuthenticationRoute
)).pipe(
  Layer.provide(NodeSdkLive),
  Layer.provide(HttpApiBuilder.middlewareOpenApi({ path: "/openapi.json" })),
  Layer.provide(HttpApiScalar.layer({ path: "/reference" })),
  Layer.provide(HttpApiSwagger.layer({ path: "/doc" })),
  Layer.provide(ApiLive),
  Layer.provide(NodeContext.layer),
  Layer.provide(
    Layer.mergeAll(
      IdempotencyRedis({}).pipe(
        Layer.provide(Redis(ConfigLive.pipe(Config.map((options) => options.Redis))))
      ),
      TextDecoder({ encoding: "utf-8" })
    )
  ),
  Layer.provide(Logger.minimumLogLevel(LogLevel.Debug)),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(http.createServer, { port: 3001 })),
  gracefulShutdown,
  Layer.launch,
  NodeRuntime.runMain
)
