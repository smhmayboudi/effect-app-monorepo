import type { SuccessArray } from "@template/domain/shared/adapter/Response"
import type { URLParams } from "@template/domain/shared/adapter/URLParams"
import type { Todo, TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import type { TodoErrorAlreadyExists } from "@template/domain/todo/application/TodoApplicationErrorAlreadyExists"
import type { TodoErrorNotFound } from "@template/domain/todo/application/TodoApplicationErrorNotFound"
import type { Exit } from "effect"
import { PortEventEmitter } from "../../../infrastructure/application/PortEventEmitter.js"

type TodoEvents = {
  TodoUseCaseCreate: {
    in: { todo: Omit<Todo, "createdAt" | "updatedAt" | "deletedAt"> }
    out: Exit.Exit<TodoId, TodoErrorAlreadyExists>
  }
  TodoUseCaseDelete: { in: { id: TodoId }; out: Exit.Exit<TodoId, TodoErrorNotFound> }
  TodoUseCaseReadAll: {
    in: { urlParams: URLParams<Todo> }
    out: Exit.Exit<SuccessArray<Todo, never, never>>
  }
  TodoUseCaseReadById: { in: { id: TodoId }; out: Exit.Exit<Todo, TodoErrorNotFound> }
  TodoUseCaseUpdate: {
    in: { id: TodoId; todo: Partial<Omit<Todo, "id" | "createdAt" | "updatedAt" | "deletedAt">> }
    out: Exit.Exit<TodoId, TodoErrorAlreadyExists | TodoErrorNotFound>
  }
}

export const TodoPortEventEmitter = PortEventEmitter<TodoEvents>()
