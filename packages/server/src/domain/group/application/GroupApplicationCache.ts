import * as expRequestResolver from "@effect/experimental/RequestResolver"
import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions"
import { Group, GroupId } from "@template/domain/group/application/GroupApplicationDomain"
import { GroupErrorNotFound } from "@template/domain/group/application/GroupApplicationErrorNotFound"
import * as Effect from "effect/Effect"
import * as Exit from "effect/Exit"
import * as PrimaryKey from "effect/PrimaryKey"
import * as RequestResolver from "effect/RequestResolver"
import * as Schema from "effect/Schema"
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

export const makeGroupReadResolver = Effect.all([GroupConfig, GroupPortDriven]).pipe(
  Effect.flatMap(([{ cacheTTLMs }, driven]) =>
    RequestResolver.fromEffectTagged<GroupReadById>()({
      GroupReadById: (requests) =>
        driven.readByIds(requests.map((req) => req.id)).pipe(
          Effect.withSpan("GroupUseCase", {
            attributes: { [ATTR_CODE_FUNCTION_NAME]: "GroupReadById", requests }
          }),
          Effect.tap(() => Effect.logDebug(`DB hit: GroupReadById ${requests.length}`))
        )
    }).pipe(
      expRequestResolver.persisted({
        storeId: "Group",
        timeToLive: (_req, exit) => Exit.isSuccess(exit) ? cacheTTLMs : 0
      })
    )
  )
)
