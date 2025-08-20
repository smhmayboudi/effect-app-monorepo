import { HttpApiClient, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { describe, expect, it } from "@effect/vitest"
import { Api } from "@template/domain/Api"
import { Email } from "@template/domain/user/application/UserApplicationDomain"
import { Effect, Layer, Redacted } from "effect"

const baseUrl = "http://127.0.0.1:3001"

const HttpClientTest = HttpClient.make((req) => {
  if (req.method === "POST" && req.url === `${baseUrl}/api/v1/user`) {
    return Effect.succeed(
      HttpClientResponse.fromWeb(
        req,
        new Response(JSON.stringify({
          data: {
            id: 1,
            ownerId: 1,
            email: "smhmayboudi@gmail.com",
            createdAt: "2025-08-08 08:08",
            updatedAt: "2025-08-08 08:08",
            accessToken: "access-token"
          }
        }))
      )
    )
  }
  if (req.method === "GET" && req.url === `${baseUrl}/api/v1/user`) {
    return Effect.succeed(
      HttpClientResponse.fromWeb(
        req,
        new Response(JSON.stringify({ data: [], hasMore: false, limit: 0, offset: 0, total: 0 }))
      )
    )
  }
  if (req.method === "DELETE" && req.url === `${baseUrl}/api/v1/user/1`) {
    return Effect.succeed(
      HttpClientResponse.fromWeb(
        req,
        new Response(JSON.stringify({ data: 1 }))
      )
    )
  }

  return Effect.succeed(
    HttpClientResponse.fromWeb(
      req,
      new Response(JSON.stringify({}))
    )
  )
})

describe("UserApi", () => {
  it.effect("should get the list of users", () =>
    Effect.gen(function*() {
      const client = yield* HttpApiClient.make(Api, { baseUrl })
      const user = yield* client.user.create({
        payload: { email: Email.make("smhmayboudi@gmail.com") }
      })
      const clientWithAuth = yield* HttpClient.HttpClient.pipe(
        Effect.flatMap((baseHttpClient) => {
          const httpClient = baseHttpClient.pipe(HttpClient.mapRequest(
            HttpClientRequest.setHeader("token", Redacted.value(user.data.accessToken))
          ))

          return HttpApiClient.makeWith(Api, { baseUrl, httpClient })
        })
      )
      const users = yield* clientWithAuth.user.readAll({ urlParams: {} })
      expect(users.data.length).toEqual(0)
      yield* clientWithAuth.user.delete({ path: { id: user.data.id } })
    }).pipe(
      // Effect.provide(NodeHttpClient.layer)
      Effect.provide(Layer.succeed(HttpClient.HttpClient, HttpClientTest))
    ))
})
