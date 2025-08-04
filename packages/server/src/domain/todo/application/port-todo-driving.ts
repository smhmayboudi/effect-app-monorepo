import type { ActorAuthorized } from "@template/domain/actor"
import type { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"
import type { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"
import type { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { Context, type Effect } from "effect"

export class PortTodoDriving extends Context.Tag("PortTodoDriving")<PortTodoDriving, {
  create: (
    todo: Omit<DomainTodo, "id" | "createdAt" | "updatedAt">
  ) => Effect.Effect<TodoId, ErrorTodoAlreadyExists, ActorAuthorized<"Todo", "create">>
  delete: (id: TodoId) => Effect.Effect<TodoId, ErrorTodoNotFound, ActorAuthorized<"Todo", "delete">>
  readAll: () => Effect.Effect<Array<DomainTodo>, never, ActorAuthorized<"Todo", "readAll">>
  readById: (id: TodoId) => Effect.Effect<DomainTodo, ErrorTodoNotFound, ActorAuthorized<"Todo", "readById">>
  update: (
    id: TodoId,
    todo: Partial<Omit<DomainTodo, "id" | "createdAt" | "updatedAt">>
  ) => Effect.Effect<TodoId, ErrorTodoNotFound, ActorAuthorized<"Todo", "update">>
}>() {}
