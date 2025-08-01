import { HttpApiBuilder } from "@effect/platform"
import { Api } from "@template/domain/api"
import { Effect } from "effect"
import { PortPersonDriving } from "../application/port-person-driving.js"
import { PortPersonPolicy } from "../application/person-policy.js"
import { policyUse } from "../../../util/policy.js"
import { PersonId } from "@template/domain/person/application/domain-person"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"

export const PersonDriving = HttpApiBuilder.group(Api, "person", (handlers) =>
  Effect.gen(function*() {
    const driving = yield* PortPersonDriving
    const policy = yield* PortPersonPolicy

    return handlers
      .handle("create", ({ path, payload }) =>
        driving.create({ ...payload, groupId: path.groupId }).pipe(
          Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", person: { ...payload, groupId: path.groupId }}}),
          policyUse(policy.canCreate(PersonId.make(0)))
        )
      )
      // .handle("delete", ({ path: { id }}) =>
      //   driving.delete(id).pipe(
      //     Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id }}),
      //     policyUse(policy.canDelete(PersonId.make(0)))
      //   )
      // )
      // .handle("readAll", () =>
      //   driving.readAll().pipe(
      //     Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" }}),
      //     policyUse(policy.canReadAll(PersonId.make(0)))
      //   )
      // )
      .handle("readById", ({ path: { id }}) =>
        driving.readById(id).pipe(
          Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id }}),
          policyUse(policy.canReadById(PersonId.make(0)))
        )
      )
      // .handle("update", ({ path: { id }}) =>
      //   driving.update(id, { payload }).pipe(
      //     Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, person: payload }}),
      //     policyUse(policy.canUpdate(PersonId.make(0)))
      //   )
      // )
  }))
