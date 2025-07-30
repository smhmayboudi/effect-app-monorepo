import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortUserDriving } from "../application/port-user-driving.js"
import { AccountId } from "@template/domain/account/application/domain-account"
import { UserId } from "@template/domain/user/application/domain-user"

export const UserDriving = HttpApiBuilder.group(Api, "user", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortUserDriving

    return handlers
      .handle("create", ({ payload }) => driving.create({
        ...payload,
        accountId: AccountId.make(0)
      }))
      .handle("delete", ({ path: { id } }) => driving.delete(id))
      .handle("readAll", () => driving.readAll())
      .handle("readById", ({ path: { id } }) => driving.readById(id))
      .handle("readByMe", () => driving.readByMe(UserId.make(0)))
      .handle("update", ({ path: { id }, payload }) => driving.update(id, payload))
  }))
