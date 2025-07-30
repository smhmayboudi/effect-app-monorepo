import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortPersonDriving } from "../application/port-person-driving.js"
import { GroupId } from "@template/domain/group/application/domain-group"
import { PortPersonPolicy } from "../application/person-policy.js"
import { policyUse } from "../../../util/policy.js"
import { PersonId } from "@template/domain/person/application/domain-person"

export const PersonDriving = HttpApiBuilder.group(Api, "person", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortPersonDriving
    const policy = yield* PortPersonPolicy

    return handlers
      .handle("create", ({ payload }) =>
        driving.create({ ...payload, groupId: GroupId.make(0) }).pipe(
          policyUse(policy.canCreate(PersonId.make(0)))
        )
      )
      // .handle("delete", ({ path: { id } }) =>
      //   driving.delete(id).pipe(
      //     policyUse(policy.canDelete(PersonId.make(0)))
      //   )
      // )
      // .handle("readAll", () =>
      //   driving.readAll().pipe(
      //     policyUse(policy.canReadAll(PersonId.make(0)))
      //   )
      // )
      .handle("readById", ({ path: { id } }) =>
        driving.readById(id).pipe(
          policyUse(policy.canReadById(PersonId.make(0)))
        )
      )
      // .handle("update", ({ path: { id } }) =>
      //   driving.update(id, { done: true }).pipe(
      //     policyUse(policy.canUpdate(PersonId.make(0)))
      //   )
      // )
  }))
