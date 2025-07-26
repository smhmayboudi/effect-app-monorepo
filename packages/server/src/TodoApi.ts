import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/Api"
import { Effect } from "effect"
import { TodoRepository } from "./TodoRepository.js"

export const TodoApiLive = HttpApiBuilder.group(Api, "todo", (handlers) =>
  Effect.gen(function*() {
    const todoRepository = yield* TodoRepository

    return handlers
      .handle("create", ({ payload: { text } }) => todoRepository.create(text))
      .handle("delete", ({ path: { id } }) => todoRepository.del(id))
      .handle("readAll", () => todoRepository.readAll())
      .handle("readById", ({ path: { id } }) => todoRepository.readById(id))
      .handle("update", ({ path: { id } }) => todoRepository.update(id))
  }))
