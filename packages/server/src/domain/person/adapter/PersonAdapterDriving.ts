import * as HttpApiBuilder from "@effect/platform/HttpApiBuilder"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Api } from "@template/domain/Api"
import { GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { PersonId } from "@template/domain/person/application/PersonApplicationDomain"
import * as Effect from "effect/Effect"
import { response } from "../../../shared/adapter/Response.js"
import { policyUse } from "../../../util/Policy.js"
import { GroupPortPolicy } from "../../group/application/GroupApplicationPortPolicy.js"
import { PersonPortDriving } from "../application/PersonApplicationPortDriving.js"
import { PersonPortPolicy } from "../application/PersonApplicationPortPolicy.js"

export const PersonDriving = HttpApiBuilder.group(
  Api,
  "person",
  (handlers) =>
    Effect.all([GroupPortPolicy, PersonPortDriving, PersonPortPolicy]).pipe(
      Effect.andThen(([groupPolicy, driving, policy]) =>
        handlers
          .handle("create", ({ path: { groupId }, payload }) =>
            driving.create({ ...payload, groupId }).pipe(
              Effect.withSpan("PersonDriving", {
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "create", person: { ...payload, groupId } }
              }),
              policyUse(policy.canCreate(PersonId.make("00000000-0000-0000-0000-000000000000"))),
              policyUse(groupPolicy.canReadById(GroupId.make("00000000-0000-0000-0000-000000000000"))),
              response
            ))
          // .handle("delete", ({ path: { id }}) =>
          //   driving.delete(id).pipe(
          //     Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "delete", id }}),
          //     policyUse(policy.canDelete(PersonId.make("00000000-0000-0000-0000-000000000000"))),
          //     response
          //   )
          // )
          // .handle("readAll", ({ urlParams }) =>
          //   driving.readAll(urlParams).pipe(
          //     Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAll" }}),
          //     policyUse(policy.canReadAll(PersonId.make("00000000-0000-0000-0000-000000000000"))),
          //     response
          //   )
          // )
          .handle("readById", ({ path: { id } }) =>
            driving.readById(id).pipe(
              Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "readById", id } }),
              policyUse(policy.canReadById(PersonId.make("00000000-0000-0000-0000-000000000000"))),
              response
            ))
        // .handle("update", ({ path: { id }}) =>
        //   driving.update(id, { payload }).pipe(
        //     Effect.withSpan("PersonDriving", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "update", id, person: payload }}),
        //     policyUse(policy.canUpdate(PersonId.make("00000000-0000-0000-0000-000000000000"))),
        //     response
        //   )
        // )
      )
    )
)
