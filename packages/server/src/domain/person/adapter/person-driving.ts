import { HttpApiBuilder } from "@effect/platform"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Api } from "@template/domain/Api"
import { GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import { Effect } from "effect"
import { response } from "../../../shared/application/Response.js"
import { policyUse } from "../../../util/policy.js"
import { PortGroupPolicy } from "../../group/application/group-policy.js"
import { PortPersonPolicy } from "../application/person-policy.js"
import { PortPersonDriving } from "../application/port-person-driving.js"

export const PersonDriving = HttpApiBuilder.group(Api, "person", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortPersonDriving
    const policy = yield* PortPersonPolicy
    const groupPolicy = yield* PortGroupPolicy

    return handlers
      .handle("create", ({ path: { groupId }, payload }) =>
        driving.create({ ...payload, groupId }).pipe(
          Effect.withSpan("PersonDriving", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", person: { ...payload, groupId } }
          }),
          policyUse(policy.canCreate(PersonId.make(0))),
          policyUse(groupPolicy.canReadById(GroupId.make(0))),
          response
        ))
      // .handle("delete", ({ path: { id }}) =>
      //   driving.delete(id).pipe(
      //     Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id }}),
      //     policyUse(policy.canDelete(PersonId.make(0))),
      //     response
      //   )
      // )
      // .handle("readAll", () =>
      //   driving.readAll().pipe(
      //     Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" }}),
      //     policyUse(policy.canReadAll(PersonId.make(0))),
      //     response
      //   )
      // )
      .handle("readById", ({ path: { id } }) =>
        driving.readById(id).pipe(
          Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
          policyUse(policy.canReadById(PersonId.make(0))),
          response
        ))
    // .handle("update", ({ path: { id }}) =>
    //   driving.update(id, { payload }).pipe(
    //     Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, person: payload }}),
    //     policyUse(policy.canUpdate(PersonId.make(0))),
    //     response
    //   )
    // )
  }))
