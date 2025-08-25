import { HttpApiClient, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { describe, expect, it } from "@effect/vitest"
import { AccountId } from "@template/domain/account/application/AccountApplicationDomain"
import { Api } from "@template/domain/Api"
import { AccessToken, Email, UserId, UserWithSensitive } from "@template/domain/user/application/UserApplicationDomain"
import { Effect, Layer, Redacted } from "effect"

const baseUrl = "http://127.0.0.1:3001"

const HttpClientTest = HttpClient.make((req) => {
  if (req.method === "POST" && req.url === `${baseUrl}/api/v1/user`) {
    const now = new Date()

    return Effect.succeed(
      HttpClientResponse.fromWeb(
        req,
        new Response(JSON.stringify({
          data: UserWithSensitive.make({
            id: UserId.make("00000000-0000-0000-0000-000000000000"),
            ownerId: AccountId.make("00000000-0000-0000-0000-000000000000"),
            email: Email.make("smhmayboudi@gmail.com"),
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            accessToken: AccessToken.make(Redacted.make("access-token"))
          })
        }))
      )
    )
  }
  if (req.method === "GET" && req.url === `${baseUrl}/api/v1/todo`) {
    return Effect.succeed(
      HttpClientResponse.fromWeb(
        req,
        new Response(JSON.stringify({ data: [], hasMore: false, limit: 0, offset: 0, total: 0 }))
      )
    )
  }
  if (req.method === "DELETE" && req.url === `${baseUrl}/api/v1/user/00000000-0000-0000-0000-000000000000`) {
    return Effect.succeed(
      HttpClientResponse.fromWeb(
        req,
        new Response(JSON.stringify({ data: UserId.make("00000000-0000-0000-0000-000000000000") }))
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
      const todos = yield* clientWithAuth.todo.readAll({ urlParams: {} })
      expect(todos.data.length).toEqual(0)
      yield* clientWithAuth.user.delete({ path: { id: user.data.id } })
    }).pipe(
      // Effect.provide(NodeHttpClient.layer)
      Effect.provide(Layer.succeed(HttpClient.HttpClient, HttpClientTest))
    ))
})
