import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortGroupDriving } from "../application/port-group-driving.js"
import { PortGroupPolicy } from "../../group/application/group-policy.js"
import { policyUse } from "../../../util/policy.js"
import { GroupId } from "@template/domain/group/application/domain-group"
import { DomainActor } from "@template/domain/actor"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"

export const GroupDriving = HttpApiBuilder.group(Api, "group", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortGroupDriving
    const policy = yield* PortGroupPolicy

    return handlers
      .handle("create", ({ payload }) =>
        DomainActor.pipe(
          Effect.flatMap((user) => driving.create({ ...payload, ownerId: user.ownerId})),
          Effect.withSpan("GroupDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create" }}),
          policyUse(policy.canCreate(GroupId.make(0)))
        )
      )
      // .handle("delete", ({ path: { id } }) =>
      //   driving.delete(id).pipe(
      //     Effect.withSpan("GroupDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete" }}),
      //     policyUse(policy.canDelete(GroupId.make(0)))
      //   )
      // )
      // .handle("readAll", () =>
      //   driving.readAll().pipe(
      //     Effect.withSpan("GroupDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" }}),
      //     policyUse(policy.canReadAll(GroupId.make(0)))
      //   )
      // )
      // .handle("readById", ({ path: { id } }) =>
      //   driving.readById(id).pipe(
      //     Effect.withSpan("GroupDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById" }}),
      //     policyUse(policy.readById(GroupId.make(0)))
      //   )
      // )
      .handle("update", ({ path: { id }, payload }) =>
        driving.update(id, payload).pipe(
          Effect.withSpan("GroupDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update" }}),
          policyUse(policy.canUpdate(GroupId.make(0)))
        )
      )
  }))
