import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortTodoDriving } from "../application/port-todo-driving.js";
import { AccountId } from "@template/domain/account/application/domain-account";

export const TodoDriving = HttpApiBuilder.group(Api, "todo", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortTodoDriving

    return handlers
      .handle("create", ({ payload }) => driving.create({
        ...payload,
        accountId: AccountId.make(0),
        done: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      .handle("delete", ({ path: { id } }) => driving.delete(id))
      .handle("readAll", () => driving.readAll())
      .handle("readById", ({ path: { id } }) => driving.readById(id))
      .handle("update", ({ path: { id } }) => driving.update(id, { done: true }))
  }))
