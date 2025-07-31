import { HttpApiBuilder, HttpApiScalar, HttpApiSwagger, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import { createServer } from "node:http"
import { ApiLive } from "./api.js"
import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { NodeSdk } from "@effect/opentelemetry";
import { ConsoleLogRecordExporter, SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { ConsoleMetricExporter, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

const NodeSdkLive = NodeSdk.layer(() => ({
  logRecordProcessor: new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()),
  metricReader: new PeriodicExportingMetricReader({ exporter: new ConsoleMetricExporter() }),
  resource: { serviceName: "effect-app-monorepo", serviceVersion: "0.0.0" },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter())
}))

const HttpApiLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi({ path: "/openapi.json" })),
  Layer.provide(HttpApiScalar.layer({ path: "/references" })),
  Layer.provide(HttpApiSwagger.layer({ path: "/docs" })),
  Layer.provide(ApiLive),
  Layer.provide(NodeSdkLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

Layer.launch(HttpApiLive).pipe(NodeRuntime.runMain)
