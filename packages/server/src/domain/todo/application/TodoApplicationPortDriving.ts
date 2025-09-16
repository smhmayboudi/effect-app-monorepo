import type { ActorAuthorized } from "@template/domain/Actor"
import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { Todo, TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import type { TodoErrorAlreadyExists } from "@template/domain/todo/application/TodoApplicationErrorAlreadyExists"
import type { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import { Context, type Effect } from "effect"

export class TodoPortDriving extends Context.Tag("TodoPortDriving")<TodoPortDriving, {
  create: (
    todo: Omit<Todo, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ) => Effect.Effect<TodoId, TodoErrorAlreadyExists, ActorAuthorized<"Todo", "create">>
  delete: (id: TodoId) => Effect.Effect<TodoId, TodoErrorNotFound, ActorAuthorized<"Todo", "delete">>
  readAll: (
    urlParams: URLParams<Todo>
  ) => Effect.Effect<SuccessArray<Todo, never, never>, never, ActorAuthorized<"Todo", "readAll">>
  readById: (id: TodoId) => Effect.Effect<Todo, TodoErrorNotFound, ActorAuthorized<"Todo", "readById">>
  update: (
    id: TodoId,
    todo: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt" | "deletedAt">>
  ) => Effect.Effect<TodoId, TodoErrorAlreadyExists | TodoErrorNotFound, ActorAuthorized<"Todo", "update">>
}>() {}
