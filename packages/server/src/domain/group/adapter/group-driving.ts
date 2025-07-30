import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortGroupDriving } from "../application/port-group-driving.js"
import { AccountId } from "@template/domain/account/application/domain-account"

export const GroupDriving = HttpApiBuilder.group(Api, "group", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortGroupDriving

    return handlers
      .handle("create", ({ payload }) => driving.create({
        ...payload,
        ownerId: AccountId.make(0)
      }))
      // .handle("delete", ({ path: { id } }) => driving.delete(id))
      // .handle("readAll", () => driving.readAll())
      // .handle("readById", ({ path: { id } }) => driving.readById(id))
      .handle("update", ({ path: { id }, payload }) => driving.update(id, payload))
  }))
