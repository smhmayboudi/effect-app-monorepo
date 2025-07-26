import { HttpApiClient } from "@effect/platform"
import { NodeHttpClient } from "@effect/platform-node"

import { describe, expect, it } from "@effect/vitest"
import { TodoApi } from "@template/domain/TodoApi"
import { Effect } from "effect"

describe("TodoApi", () => {
  it.effect("should get the list of todos", () =>
    Effect.gen(function*() {
      const client = yield* HttpApiClient.make(TodoApi, {
        baseUrl: "http://localhost:3000/"
      })

      const todos = yield* client.todo.readAll()
      expect(todos.length).toEqual(2)
    }).pipe(
      Effect.provide(NodeHttpClient.layer)
    ))

  it.effect("should create a todo", () =>
    Effect.gen(function*() {
      const client = yield* HttpApiClient.make(TodoApi, {
        baseUrl: "http://localhost:3000/"
      })
      const text = "my new todo"
      const todo = yield* client.todo.create({ payload: { text } })
      expect(todo.text).toEqual(text)
    }).pipe(
      Effect.provide(NodeHttpClient.layer)
    ))
})
