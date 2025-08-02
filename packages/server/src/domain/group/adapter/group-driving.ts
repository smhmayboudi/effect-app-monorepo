import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortGroupDriving } from "@template/server/domain/group/application/port-group-driving"
import { PortGroupPolicy } from "@template/server/domain/group/application/group-policy"
import { policyUse } from "@template/server/util/policy"
import { GroupId } from "@template/domain/group/application/domain-group"
import { DomainActor } from "@template/domain/actor"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { response } from "@template/server/shared/application/response"

export const GroupDriving = HttpApiBuilder.group(Api, "group", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortGroupDriving
    const policy = yield* PortGroupPolicy

    return handlers
      .handle("create", ({ payload }) =>
        DomainActor.pipe(
          Effect.flatMap((user) => driving.create({ ...payload, ownerId: user.ownerId }).pipe(
            Effect.withSpan("GroupDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", group: { ...payload, ownerId: user.ownerId }}}),
          )),
          policyUse(policy.canCreate(GroupId.make(0))),
          response
        )
      )
      // .handle("delete", ({ path: { id }}) =>
      //   driving.delete(id).pipe(
      //     Effect.withSpan("GroupDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id }}),
      //     policyUse(policy.canDelete(GroupId.make(0))),
      //     response
      //   )
      // )
      // .handle("readAll", () =>
      //   driving.readAll().pipe(
      //     Effect.withSpan("GroupDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" }}),
      //     policyUse(policy.canReadAll(GroupId.make(0))),
      //     response
      //   )
      // )
      // .handle("readById", ({ path: { id }}) =>
      //   driving.readById(id).pipe(
      //     Effect.withSpan("GroupDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id }}),
      //     policyUse(policy.readById(GroupId.make(0))),
      //     response
      //   )
      // )
      .handle("update", ({ path: { id }, payload }) =>
        driving.update(id, payload).pipe(
          Effect.withSpan("GroupDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, group: payload }}),
          policyUse(policy.canUpdate(GroupId.make(0))),
          response
        )
      )
  }))
