import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import type { ActorAuthorized } from "@template/domain/Actor"
import type { Todo, TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import type { TodoErrorAlreadyExists } from "@template/domain/todo/application/TodoApplicationErrorAlreadyExists"
import type { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import { Effect, Layer } from "effect"
import { policyRequire } from "../../../util/policy.js"
import { PortTodoDriven } from "./port-todo-driven.js"
import { PortTodoDriving } from "./port-todo-driving.js"

export const TodoUseCase = Layer.effect(
  PortTodoDriving,
  Effect.gen(function*() {
    const driven = yield* PortTodoDriven

    const create = (
      todo: Omit<Todo, "id" | "createdAt" | "updatedAt">
    ): Effect.Effect<TodoId, TodoErrorAlreadyExists, ActorAuthorized<"Todo", "create">> =>
      driven.create(todo)
        .pipe(
          Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "crteate", todo } }),
          policyRequire("Todo", "create")
        )

    const del = (id: TodoId): Effect.Effect<TodoId, TodoErrorNotFound, ActorAuthorized<"Todo", "delete">> =>
      driven.delete(id)
        .pipe(
          Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id } }),
          policyRequire("Todo", "delete")
        )

    const readAll = (): Effect.Effect<Array<Todo>, never, ActorAuthorized<"Todo", "readAll">> =>
      driven.readAll().pipe(
        Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" } }),
        policyRequire("Todo", "readAll")
      )

    const readById = (id: TodoId): Effect.Effect<Todo, TodoErrorNotFound, ActorAuthorized<"Todo", "readById">> =>
      driven.readById(id).pipe(
        Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
        policyRequire("Todo", "readById")
      )

    const update = (
      id: TodoId,
      todo: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt">>
    ): Effect.Effect<TodoId, TodoErrorNotFound, ActorAuthorized<"Todo", "update">> =>
      driven.update(id, todo)
        .pipe(
          Effect.withSpan("TodoUseCase", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, todo } }),
          policyRequire("Todo", "update")
        )

    return {
      create,
      delete: del,
      readAll,
      readById,
      update
    } as const
  })
)
