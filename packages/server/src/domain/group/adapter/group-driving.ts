import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortGroupDriving } from "../application/port-group-driving.js"
import { AccountId } from "@template/domain/account/application/domain-account"
import { PortGroupPolicy } from "../../group/application/group-policy.js"
import { policyUse } from "../../../util/policy.js"
import { GroupId } from "@template/domain/group/application/domain-group"

export const GroupDriving = HttpApiBuilder.group(Api, "group", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortGroupDriving
    const policy = yield* PortGroupPolicy

    return handlers
      .handle("create", ({ payload }) =>
        driving.create({ ...payload, ownerId: AccountId.make(0)}).pipe(
          policyUse(policy.canCreate(GroupId.make(0)))
        )
      )
      // .handle("delete", ({ path: { id } }) =>
      //   driving.delete(id).pipe(
      //     policyUse(policy.canDelete(GroupId.make(0)))
      //   )
      // )
      // .handle("readAll", () =>
      //   driving.readAll().pipe(
      //     policyUse(policy.canReadAll(GroupId.make(0)))
      //   )
      // )
      // .handle("readById", ({ path: { id } }) =>
      //   driving.readById(id).pipe(
      //     policyUse(policy.readById(GroupId.make(0)))
      //   )
      // )
      .handle("update", ({ path: { id }, payload }) =>
        driving.update(id, payload).pipe(
          policyUse(policy.canUpdate(GroupId.make(0)))
        )
      )
  }))
