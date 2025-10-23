import * as HttpApiBuilder from "@effect/platform/HttpApiBuilder"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Api } from "@template/domain/Api"
import * as Effect from "effect/Effect"
import { responseArray } from "../../../shared/adapter/Response.js"
import { policyUse } from "../../../util/Policy.js"
import { VWPortDriving } from "../application/VWApplicationPortDriving.js"
import { VWPortPolicy } from "../application/VWApplicationPortPolicy.js"

export const VWDriving = HttpApiBuilder.group(Api, "vw", (handlers) =>
  Effect.all([VWPortDriving, VWPortPolicy]).pipe(
    Effect.andThen(([driving, policy]) =>
      handlers
        .handle("readAllGroupPersonTodo", ({ urlParams }) =>
          driving.readAllGroupPersonTodo(urlParams).pipe(
            Effect.withSpan("VWDriving", {
              attributes: { [ATTR_CODE_FUNCTION_NAME]: "readAllGroupPersonTodo", urlParams }
            }),
            policyUse(policy.canReadAllGroupPersonTodo()),
            responseArray(urlParams)
          ))
    )
  ))
