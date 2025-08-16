import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { Todo, TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import type { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import type { Exit } from "effect"
import { PortEventEmitter } from "../../../infrastructure/application/PortEventEmitter.js"

type TodoEvents = {
  TodoUseCaseCreate: {
    in: { todo: Omit<Todo, "id" | "createdAt" | "updatedAt"> }
    out: Exit.Exit<TodoId>
  }
  TodoUseCaseDelete: { in: { id: TodoId }; out: Exit.Exit<TodoId, TodoErrorNotFound> }
  TodoUseCaseReadAll: {
    in: { urlParams: URLParams<Todo> }
    out: Exit.Exit<SuccessArray<Todo, never, never>>
  }
  TodoUseCaseReadById: { in: { id: TodoId }; out: Exit.Exit<Todo, TodoErrorNotFound> }
  TodoUseCaseUpdate: {
    in: { id: TodoId; todo: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt">> }
    out: Exit.Exit<TodoId, TodoErrorNotFound>
  }
}

export const TodoEventEmitter = PortEventEmitter<TodoEvents>()
