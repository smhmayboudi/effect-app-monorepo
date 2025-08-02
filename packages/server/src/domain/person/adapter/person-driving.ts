import { HttpApiBuilder } from "@effect/platform"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Api } from "@template/domain/api"
import { PersonId } from "@template/domain/person/application/domain-person"
import { PortPersonPolicy } from "@template/server/domain/person/application/person-policy"
import { PortPersonDriving } from "@template/server/domain/person/application/port-person-driving"
import { response } from "@template/server/shared/application/response"
import { policyUse } from "@template/server/util/policy"
import { Effect } from "effect"

export const PersonDriving = HttpApiBuilder.group(Api, "person", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortPersonDriving
    const policy = yield* PortPersonPolicy

    return handlers
      .handle("create", ({ path, payload }) =>
        driving.create({ ...payload, groupId: path.groupId }).pipe(
          Effect.withSpan("PersonDriving", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", person: { ...payload, groupId: path.groupId } }
          }),
          policyUse(policy.canCreate(PersonId.make(0))),
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
