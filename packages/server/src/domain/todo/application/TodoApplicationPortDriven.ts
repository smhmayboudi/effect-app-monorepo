import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { Todo, TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import type { TodoErrorAlreadyExists } from "@template/domain/todo/application/TodoApplicationErrorAlreadyExists"
import type { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import * as Context from "effect/Context"
import type * as Effect from "effect/Effect"

export class TodoPortDriven extends Context.Tag("TodoPortDriven")<TodoPortDriven, {
  create: (
    todo: Omit<Todo, "createdAt" | "updatedAt" | "deletedAt">
  ) => Effect.Effect<TodoId, TodoErrorAlreadyExists, never>
  delete: (id: TodoId) => Effect.Effect<TodoId, TodoErrorNotFound, never>
  readAll: (urlParams: URLParams<Todo>) => Effect.Effect<SuccessArray<Todo, never, never>>
  readById: (id: TodoId) => Effect.Effect<Todo, TodoErrorNotFound, never>
  readByIds: (ids: Array<TodoId>) => Effect.Effect<Array<Todo>, TodoErrorNotFound, never>
  update: (
    id: TodoId,
    todo: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt" | "deletedAt">>
  ) => Effect.Effect<TodoId, TodoErrorAlreadyExists | TodoErrorNotFound, never>
}>() {}
