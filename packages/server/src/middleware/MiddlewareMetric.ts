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
  counterHTTPRequestsTotal(Effect.succeed(1)).pipe(
    Effect.flatMap(() => Effect.clockWith((clock) => clock.currentTimeMillis)),
    Effect.flatMap((start) =>
      app.pipe(
        Effect.flatMap((response) =>
          Effect.clockWith((clock) => clock.currentTimeMillis).pipe(
            Effect.flatMap((end) => {
              const duration = (end - start) / 1000

              return histogramHTTPRequestDurationSeconds(Effect.succeed(duration)).pipe(
                Effect.map(() => response)
              )
            })
          )
        )
      )
    )
  )
)
