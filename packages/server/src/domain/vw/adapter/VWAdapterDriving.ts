import { HttpApiBuilder } from "@effect/platform"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Api } from "@template/domain/Api"
import { Effect } from "effect"
import { responseArray } from "../../../shared/adapter/Response.js"
import { policyUse } from "../../../util/Policy.js"
import { VWPortDriving } from "../application/VWApplicationPortDriving.js"
import { VWPortPolicy } from "../application/VWApplicationPortPolicy.js"

export const VWDriving = HttpApiBuilder.group(Api, "vw", (handlers) =>
  Effect.all([VWPortDriving, VWPortPolicy]).pipe(
    Effect.flatMap(([driving, policy]) =>
      Effect.sync(() =>
        handlers
          .handle("readAllUserGroupPerson", ({ urlParams }) =>
            driving.readAllUserGroupPerson(urlParams).pipe(
              Effect.withSpan("VWDriving", {
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAllUserGroupPerson", urlParams }
              }),
              policyUse(policy.canReadAllUserGroupPerson()),
              responseArray(urlParams)
            ))
          .handle("readAllUserTodo", ({ urlParams }) =>
            driving.readAllUserTodo(urlParams).pipe(
              Effect.withSpan("VWDriving", {
                attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAllUserTodo", urlParams }
              }),
              policyUse(policy.canReadAllUserTodo()),
              responseArray(urlParams)
            ))
      )
    )
  ))
