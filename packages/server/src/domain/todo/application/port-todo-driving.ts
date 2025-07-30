import { Context, Effect } from "effect"
import { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"
import { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"
import { ActorAuthorized } from "@template/domain/actor"

export class PortTodoDriving extends Context.Tag("PortTodoDriving")<PortTodoDriving, {
  create: (todo: Omit<DomainTodo, "id" | "createdAt" | "updatedAt">) => Effect.Effect<TodoId, ErrorTodoAlreadyExists, ActorAuthorized<"Todo", "create">>
  delete: (id: TodoId) => Effect.Effect<TodoId, ErrorTodoNotFound, ActorAuthorized<"Todo", "delete">>
  readAll: () => Effect.Effect<DomainTodo[], never, ActorAuthorized<"Todo", "readAll">>
  readById: (id: TodoId) => Effect.Effect<DomainTodo, ErrorTodoNotFound, ActorAuthorized<"Todo", "readById">>
  update: (id: TodoId, todo: Partial<Omit<DomainTodo, "id">>) => Effect.Effect<TodoId, ErrorTodoNotFound, ActorAuthorized<"Todo", "update">>
}>() {}
