import { HttpApiBuilder } from "@effect/platform"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Actor } from "@template/domain/Actor"
import { Api } from "@template/domain/Api"
import { GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { Effect } from "effect"
import { response } from "../../../shared/application/Response.js"
import { policyUse } from "../../../util/policy.js"
import { GroupPortDriving } from "../application/GroupApplicationPortDriving.js"
import { GroupPortPolicy } from "../application/GroupApplicationPortPolicy.js"

export const GroupDriving = HttpApiBuilder.group(Api, "group", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* GroupPortDriving
    const policy = yield* GroupPortPolicy

    return handlers
      .handle("create", ({ payload }) =>
        Actor.pipe(
          Effect.flatMap((user) =>
            driving.create({ ...payload, ownerId: user.ownerId }).pipe(
              Effect.withSpan("GroupDriving", {
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", group: { ...payload, ownerId: user.ownerId } }
              })
            )
          ),
          policyUse(policy.canCreate(GroupId.make(0))),
          response
        ))
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
          Effect.withSpan("GroupDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, group: payload } }),
          policyUse(policy.canUpdate(GroupId.make(0))),
          response
        ))
  }))
