import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { policy } from "../../../util/Policy.js"
import { GroupPortPolicy } from "../application/GroupApplicationPortPolicy.js"

export const GroupPolicy = Layer.effect(
  GroupPortPolicy,
  Effect.sync(() =>
    GroupPortPolicy.of({
      canCreate: (id) =>
        policy("Group", "create", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canCreate", id, actor } })
          )),
      canDelete: (id) =>
        policy("Group", "delete", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canDelete", id, actor } })
          )),
      canReadAll: (id) =>
        policy("Group", "readAll", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadAll", id, actor } })
          )),
      canReadById: (id) =>
        policy("Group", "readById", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canReadById", id, actor } })
          )),
      canUpdate: (id) =>
        policy("Group", "update", (actor) =>
          Effect.succeed(true).pipe(
            Effect.withSpan("GroupPolicy", { attributes: { [ATTR_CODE_FUNCTION_NAME]: "canUpdate", id, actor } })
          ))
    })
  )
)
