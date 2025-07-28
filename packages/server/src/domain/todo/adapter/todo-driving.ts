import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortTodoDriving } from "../application/port-todo-driving.js";

export const TodoDriving = HttpApiBuilder.group(Api, "todo", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortTodoDriving

    return handlers
      .handle("create", ({ payload }) => driving.create({ done: false, ...payload }))
      .handle("delete", ({ path: { id } }) => driving.delete(id))
      .handle("readAll", () => driving.readAll())
      .handle("readById", ({ path: { id } }) => driving.readById(id))
      .handle("update", ({ path: { id } }) => driving.update(id, { done: true }))
  }))
