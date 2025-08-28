import { HttpMiddleware, HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { IdempotencyErrorKeyMismatch } from "@template/domain/shared/application/IdempotencyErrorKeyMismatch"
import { IdempotencyErrorKeyRequired } from "@template/domain/shared/application/IdempotencyErrorKeyRequired"
import { IdempotencyErrorRequestInProgress } from "@template/domain/shared/application/IdempotencyErrorRequestInProgress"
import { IdempotencyKeyClient } from "@template/domain/shared/application/IdempotencyKeyClient"
import { Effect, Either, Option } from "effect"
import { IdempotencyKeyServer, PortIdempotency } from "../infrastructure/application/PortIdempotency.js"
import { generateDataHash, validateDataHash } from "../util/Hash.js"

export const MiddlewareIdempotency = HttpMiddleware.make((app) =>
  Effect.gen(function*() {
    const idempotency = yield* PortIdempotency
    const request = yield* HttpServerRequest.HttpServerRequest
    if (request.method !== "PATCH" && request.method !== "POST") {
      return yield* app
    }
    const idempotencyKeyHeader = request.headers["idempotency-key"]
    if (!idempotencyKeyHeader || typeof idempotencyKeyHeader !== "string") {
      return yield* HttpServerResponse.json(new IdempotencyErrorKeyRequired())
    }
    const clientKey = IdempotencyKeyClient.make(idempotencyKeyHeader)
    const body = yield* request.json
    const requestData = {
      body,
      method: request.method,
      path: request.url
    }
    const dataHash = yield* generateDataHash(requestData)
    const serverKey = IdempotencyKeyServer.make({
      clientKey,
      dataHash,
      value: `${clientKey}:${dataHash}`
    })
    const existing = yield* idempotency.retrieve(serverKey)
    if (Option.isSome(existing)) {
      const validation = yield* Effect.either(
        validateDataHash(requestData, existing.value.key.dataHash)
      )
      if (Either.isLeft(validation)) {
        return yield* HttpServerResponse.json(new IdempotencyErrorKeyMismatch({ key: clientKey }))
      }
      if (existing.value.status === "completed") {
        const responseBody = yield* Effect.try<Record<string, unknown>>(() =>
          typeof existing.value.response === "string" ? JSON.parse(existing.value.response) : existing.value.response
        )

        return yield* HttpServerResponse.json(responseBody)
      }
      if (existing.value.status === "in_progress") {
        return yield* HttpServerResponse.json(new IdempotencyErrorRequestInProgress())
      }
    }
    yield* idempotency.store(serverKey)
    try {
      const response = yield* app
      if (response.status >= 200 && response.status < 300) {
        const responseBody = yield* Effect.try<Record<string, unknown>>(() =>
          typeof response.body === "string" ? JSON.parse(response.body) : response.body
        )
        const responseBodyBody = new TextDecoder("utf-8").decode(responseBody["body"] as AllowSharedBufferSource)
        yield* idempotency.complete(serverKey, responseBodyBody)
      } else {
        yield* idempotency.fail(serverKey)
      }

      return response
    } catch (error) {
      yield* idempotency.fail(serverKey)
      throw error
    }
  }).pipe(
    Effect.catchTag("HttpBodyError", Effect.die),
    Effect.catchTag("IdempotencyError", Effect.die),
    Effect.catchTag("RequestError", Effect.die),
    Effect.catchTag("UnknownException", Effect.die)
  )
)
