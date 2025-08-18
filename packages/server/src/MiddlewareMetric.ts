import { HttpMiddleware } from "@effect/platform"
import { Effect, Metric, MetricBoundaries } from "effect"

const counterHTTPRequestsTotal = Metric.counter(
  "http_requests_total",
  {
    description: "Total number of HTTP requests"
  }
)
const histogramHTTPRequestDurationSeconds = Metric.histogram(
  "http_request_duration_seconds",
  MetricBoundaries.linear({ count: 5, start: 0.005, width: 0.005 }),
  "Duration of HTTP requests in seconds"
)

export const MiddlewareMetric = HttpMiddleware.make((app) =>
  Effect.gen(function*() {
    yield* counterHTTPRequestsTotal(Effect.succeed(1))
    const start = yield* Effect.clockWith((clock) => clock.currentTimeMillis)
    const response = yield* app
    const end = yield* Effect.clockWith((clock) => clock.currentTimeMillis)
    const duration = (end - start) / 1000
    yield* histogramHTTPRequestDurationSeconds(Effect.succeed(duration))

    return response
  })
)
