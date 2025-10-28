import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { registerOTel } from "@vercel/otel"

export function register() {
  registerOTel({
    attributes: {
      [ATTR_SERVICE_NAME]: "web",
      [ATTR_SERVICE_VERSION]: "0.0.0",
    },
    logRecordProcessors: [new BatchLogRecordProcessor(new OTLPLogExporter())],
    metricReaders: [new PeriodicExportingMetricReader({ 
      exporter: new OTLPMetricExporter() 
    })],
    spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())],
  })
}
