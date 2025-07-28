import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/Api"
import { Effect } from "effect"
import { PortTodoDriving } from "../application/port-todo-driving.js";
import { ErrorTodoAlreadyExists } from "@template/domain/todo/application/error-todo-already-exists"
import { ErrorTodoNotFound } from "@template/domain/todo/application/error-todo-not-found"
import { DomainTodo, TodoId } from "@template/domain/todo/application/domain-todo"

export const TodoDriving = HttpApiBuilder.group(Api, "todo", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortTodoDriving

    return handlers
      .handle("create", ({ payload: { text } }) => driving.create({ done: false, text }))
      .handle("delete", ({ path: { id } }) => driving.delete(id))
      .handle("readAll", () => driving.readAll())
      .handle("readById", ({ path: { id } }) => driving.readById(id))
      .handle("update", ({ path: { id } }) => driving.update(id, { done: true }))
  }))
