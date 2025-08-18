import { HttpApiClient, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { describe, expect, it } from "@effect/vitest"
import { Api } from "@template/domain/Api"
import { Email } from "@template/domain/user/application/UserApplicationDomain"
import { Effect, Layer, Redacted } from "effect"

const myClient = HttpClient.make((req) => {
  if (req.method === "POST" && req.url === "http://localhost:3001/user") {
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
  if (req.method === "GET" && req.url === "http://localhost:3001/todo") {
    return Effect.succeed(
      HttpClientResponse.fromWeb(
        req,
        new Response(JSON.stringify({ data: [], hasMore: false, limit: 0, offset: 0, total: 0 }))
      )
    )
  }
  if (req.method === "DELETE" && req.url === "http://localhost:3001/user/1") {
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

describe("TodoApi", () => {
  it.effect("should get the list of todos", () =>
    Effect.gen(function*() {
      const client = yield* HttpApiClient.make(Api, {
        baseUrl: "http://localhost:3001"
      })
      const user = yield* client.user.create({
        payload: { email: Email.make("smhmayboudi@gmail.com") }
      })
      const clientWithAuth = yield* HttpClient.HttpClient.pipe(
        Effect.flatMap((baseHttpClient) => {
          const httpClient = baseHttpClient.pipe(HttpClient.mapRequest(
            HttpClientRequest.setHeader("Cookie", `token=${Redacted.value(user.data.accessToken)}`)
          ))
          return HttpApiClient.makeWith(Api, {
            baseUrl: "http://localhost:3001",
            httpClient
          })
        })
      )
      const todos = yield* clientWithAuth.todo.readAll({ urlParams: {} })
      expect(todos.data.length).toEqual(0)
      yield* clientWithAuth.user.delete({ path: { id: user.data.id } })
    }).pipe(
      // Effect.provide(NodeHttpClient.layer)
      Effect.provide(Layer.succeed(HttpClient.HttpClient, myClient))
    ))
})
