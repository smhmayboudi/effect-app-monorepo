#!/usr/bin/env node

import * as NodeSdk from "@effect/opentelemetry/NodeSdk"
import * as NodeContext from "@effect/platform-node/NodeContext"
import * as NodeHttpClient from "@effect/platform-node/NodeHttpClient"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { cli } from "./Cli.js"
import { TodoClient, UUID } from "./TodoClient.js"

const NodeSdkLive = NodeSdk.layer(() => ({
  logRecordProcessor: new BatchLogRecordProcessor(new OTLPLogExporter()),
  metricReader: new PeriodicExportingMetricReader({ exporter: new OTLPMetricExporter() }),
  resource: { serviceName: "cli", serviceVersion: "0.0.0" },
  spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter())
}))

const Bin = TodoClient.pipe(
  Layer.provide(NodeSdkLive),
  Layer.provide(UUID),
  Layer.provide(NodeHttpClient.layerUndici),
  Layer.merge(NodeContext.layer)
)

Effect.suspend(() => cli(process.argv)).pipe(
  Effect.provide(Bin),
  NodeRuntime.runMain
)
