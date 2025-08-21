import { persisted } from "@effect/experimental/RequestResolver"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import { Effect, Exit, PrimaryKey, RequestResolver, Schema } from "effect"
import { logDebugWithTrace } from "../../../util/Logger.js"
import { GroupConfig } from "./GroupApplicationConfig.js"
import { GroupPortDriven } from "./GroupApplicationPortDriven.js"

export class GroupReadById extends Schema.TaggedRequest<GroupReadById>("GroupReadById")("GroupReadById", {
  failure: GroupErrorNotFound,
  payload: { id: GroupId },
  success: Group
}) {
  [PrimaryKey.symbol]() {
    return `GroupReadById:${this.id}`
  }
}

export const makeGroupReadResolver = Effect.gen(function*() {
  const { cacheTTLMs } = yield* GroupConfig
  const driven = yield* GroupPortDriven
  const resolver = yield* RequestResolver.fromEffectTagged<GroupReadById>()({
    GroupReadById: (requests) =>
      driven.readByIds(requests.map((req) => req.id)).pipe(
        Effect.withSpan("GroupUseCase", {
          attributes: { [ATTR_CODE_FUNCTION_NAME]: "GroupReadById", requests }
        }),
        Effect.tap(() => logDebugWithTrace(`DB hit: GroupReadById ${requests.length}`))
      )
  }).pipe(
    persisted({
      storeId: "Group",
      timeToLive: (_req, exit) => Exit.isSuccess(exit) ? cacheTTLMs : 0
    })
  )

  return resolver
})
