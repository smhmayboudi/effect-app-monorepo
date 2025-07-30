import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortPersonDriving } from "../application/port-person-driving.js"
import { GroupId } from "@template/domain/group/application/domain-group"

export const PersonDriving = HttpApiBuilder.group(Api, "person", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortPersonDriving

    return handlers
      .handle("create", ({ payload }) => driving.create({
        ...payload,
        groupId: GroupId.make(0)
      }))
      // .handle("delete", ({ path: { id } }) => driving.delete(id))
      // .handle("readAll", () => driving.readAll())
      .handle("readById", ({ path: { id } }) => driving.readById(id))
      // .handle("update", ({ path: { id } }) => driving.update(id, { done: true }))
  }))
