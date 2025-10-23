import * as effect from "effect"
import * as Effect from "effect/Effect"
import { checkRateLimit, provideLayer } from "./RateLimitApp.js"

const runExamples = async () => {
  console.log("Testing fixed-window rate limiting...")
  const userId = "user123"
  const ip = "192.168.1.1"
  for (let i = 0; i < 10; i++) {
    const resultFW = await effect.pipe(
      checkRateLimit(`login:${userId}:${ip}`, "fixed-window"),
      Effect.flatMap((result) => {
        // Process API request
        return Effect.succeed({ success: true, remaining: result.remaining })
      }),
      Effect.catchTag("RateLimitError", (error) =>
        Effect.succeed({
          success: false,
          error: error.message,
          retryAfter: error.retryAfter
        })),
      provideLayer,
      Effect.runPromise
    )
    console.log(`fixed-window request ${i + 1}:`, resultFW)
  }

  console.log("\n")
  console.log("Testing leaky-bucket rate limiting...")
  for (let i = 0; i < 10; i++) {
    const resultLB = await effect.pipe(
      checkRateLimit("custom:test", "leaky-bucket", {
        windowMs: 30000
      }),
      Effect.flatMap((result) => {
        // Process API request
        return Effect.succeed({ success: true, remaining: result.remaining })
      }),
      Effect.catchTag("RateLimitError", (error) =>
        Effect.succeed({
          processed: false,
          error: error.message,
          retryAfter: error.retryAfter
        })),
      provideLayer,
      Effect.runPromise
    )
    console.log(`leaky-bucket request ${i + 1}:`, resultLB)
  }

  console.log("\n")
  console.log("Testing sliding-window rate limiting...")
  const apiKey = "api-key-abc"
  const endpoint = "/users"
  for (let i = 0; i < 10; i++) {
    const resultSW = await effect.pipe(
      checkRateLimit(`api:${apiKey}:${endpoint}`, "sliding-window"),
      Effect.flatMap((result) => {
        // Process API request
        return Effect.succeed({ processed: true, remaining: result.remaining })
      }),
      Effect.catchTag("RateLimitError", (error) =>
        Effect.succeed({
          processed: false,
          error: error.message,
          retryAfter: error.retryAfter
        })),
      provideLayer,
      Effect.runPromise
    )
    console.log(`sliding-window request ${i + 1}:`, resultSW)
  }

  console.log("\n")
  console.log("Testing sliding-logs rate limiting...")
  for (let i = 0; i < 10; i++) {
    const resultSL = await effect.pipe(
      checkRateLimit("custom:test", "sliding-logs", {
        windowMs: 30000
      }),
      Effect.flatMap((result) => {
        // Process API request
        return Effect.succeed({ processed: true, remaining: result.remaining })
      }),
      Effect.catchTag("RateLimitError", (error) =>
        Effect.succeed({
          processed: false,
          error: error.message,
          retryAfter: error.retryAfter
        })),
      provideLayer,
      Effect.runPromise
    )
    console.log(`sliding-logs request ${i + 1}:`, resultSL)
  }

  console.log("\n")
  console.log("Testing token-bucket rate limiting...")
  for (let i = 0; i < 10; i++) {
    const resultTB = await effect.pipe(
      checkRateLimit("custom:test", "token-bucket", {
        windowMs: 30000
      }),
      Effect.flatMap((result) => {
        // Process API request
        return Effect.succeed({ processed: true, remaining: result.remaining })
      }),
      Effect.catchTag("RateLimitError", (error) =>
        Effect.succeed({
          processed: false,
          error: error.message,
          retryAfter: error.retryAfter
        })),
      provideLayer,
      Effect.runPromise
    )
    console.log(`token-bucket request ${i + 1}:`, resultTB)
  }
}

runExamples()
